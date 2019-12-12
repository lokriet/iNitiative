import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { guid } from '@datorama/akita';
import { faDiceD6, faPlay } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/state/auth.service';
import { MessageService } from 'src/app/messages/state/message.service';
import { ConditionsQuery } from 'src/app/setup/state/conditions/conditions.query';
import { DamageTypeQuery } from 'src/app/setup/state/damage-type/damage-type.query';
import { Participant, ParticipantType } from 'src/app/setup/state/participants/participant.model';
import { ParticipantQuery } from 'src/app/setup/state/participants/participant.query';

import { EncounterParticipant } from '../encounter-participant/state/encounter-participant.model';
import { EncounterParticipantQuery } from '../encounter-participant/state/encounter-participant.query';
import { EncounterParticipantService } from '../encounter-participant/state/encounter-participant.service';
import { Encounter } from '../state/encounter.model';
import { EncounterQuery } from '../state/encounter.query';
import { EncounterService } from '../state/encounter.service';

@Component({
  selector: 'app-encounter-edit',
  templateUrl: './encounter-edit.component.html',
  styleUrls: ['./encounter-edit.component.scss']
})
export class EncounterEditComponent implements OnInit, OnDestroy {
  rollIcon = faDiceD6;
  playIcon = faPlay;

  encountersLoading$: Observable<boolean>;
  participantTemplatesLoading$: Observable<boolean>;
  participantsLoading$: Observable<boolean>;
  damageTypesLoading$: Observable<boolean>;
  conditionsLoading$: Observable<boolean>;

  encounterName: string;
  errorMessage: string = null;

  addedPlayers: EncounterParticipant[] = [];
  addedMonsters: EncounterParticipant[] = [];

  editMode = false;
  editedEncounter: Encounter;
  sub: Subscription;

  constructor(private encounterService: EncounterService,
              private encounterQuery: EncounterQuery,
              private participantTemplateQuery: ParticipantQuery,
              private encounterParticipantsQuery: EncounterParticipantQuery,
              private encounterParticipantsService: EncounterParticipantService,
              private damageTypesQuery: DamageTypeQuery,
              private conditionsQuery: ConditionsQuery,
              private authService: AuthService,
              private messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.encountersLoading$ = this.encounterQuery.selectLoading();
    this.participantTemplatesLoading$ = this.participantTemplateQuery.selectLoading();
    this.participantsLoading$ = this.encounterParticipantsQuery.selectLoading();
    this.damageTypesLoading$ = this.damageTypesQuery.selectLoading();
    this.conditionsLoading$ = this.conditionsQuery.selectLoading();

    this.sub = this.route.params.subscribe(
      (params: Params) => {
        const editedEncounterId = params.id;
        this.editMode = params.id != null;
        this.initForm(editedEncounterId);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


  initForm(editedEncounterId: string) {
    if (this.editMode) {
      this.editedEncounter = this.encounterQuery.getEntity(editedEncounterId);
      if (!this.editedEncounter || this.editedEncounter.owner !== this.authService.user.uid) {
        this.router.navigate(['404']);
      } else {
        this.encounterName = this.editedEncounter.name;
        if (this.editedEncounter.participantIds) {
          this.addedMonsters = this.encounterParticipantsQuery.getAll({
            filterBy: item => this.editedEncounter.participantIds.includes(item.id) && item.type === ParticipantType.Monster
          });

          this.addedPlayers = this.encounterParticipantsQuery.getAll({
            filterBy: item => this.editedEncounter.participantIds.includes(item.id) && item.type === ParticipantType.Player
          });
        } else {
          this.addedPlayers = [];
          this.addedMonsters = [];
        }
      }
    }
  }

  onSubmitForm(startPlaying: boolean) {

    if (!this.editMode || this.editedEncounter.name !== this.encounterName) {
      const existingName = this.encounterQuery.getAll({filterBy: encounter => encounter.name === this.encounterName});
      if (existingName != null && existingName.length > 0) {
        this.errorMessage = 'Encounter with this name already exists. Choose another one';
        return;
      }
    }

    const currentDate = new Date();



    for (const player of this.addedPlayers) {
      if (this.encounterParticipantsQuery.getEntity(player.id) == null) {
        this.encounterParticipantsService.add(player);
      } else {
        this.encounterParticipantsService.update(player);
      }
    }
    for (const monster of this.addedMonsters) {
      if (this.encounterParticipantsQuery.getEntity(monster.id) == null) {
        this.encounterParticipantsService.add(monster);
      } else {
        this.encounterParticipantsService.update(monster);
      }
    }

    const newEncounter = {
      id: this.editMode ? this.editedEncounter.id : guid(),
      owner: this.authService.user.uid,
      name: this.encounterName,
      participantIds: [...this.addedPlayers.map(player => player.id), ...this.addedMonsters.map(monster => monster.id)],
      createdDate: this.editMode ? this.editedEncounter.createdDate : currentDate.getTime(),
      lastModifiedDate: currentDate.getTime(),
      activeParticipantId: this.editMode ? this.editedEncounter.activeParticipantId : null
    };

    if (this.editMode) {
      this.encounterService.add(newEncounter).then(value => {
        this.messageService.addInfo(`Yay, encounter ${this.encounterName} created!`);

        if (startPlaying) {
          this.router.navigate(['encounters', 'play', newEncounter.id]);
        } else {
          this.router.navigate(['encounters']);
        }
      });
    } else {
      this.encounterService.update(newEncounter).then(value => {
        this.messageService.addInfo(`Yay, encounter ${this.encounterName} saved!`);

        if (startPlaying) {
          this.router.navigate(['encounters', 'play', newEncounter.id]);
        } else {
          this.router.navigate(['encounters']);
        }
      });
    }
  }

  findNameWithNo(name: string): string {
    let counter = 0;
    let nextName = name;
    while (true) {
      if (this.addedPlayers.findIndex(item => item.name === nextName) === -1 && 
          this.addedMonsters.findIndex(item => item.name === nextName) === -1) {
        return nextName;
      } else {
        counter++;
        nextName = `${name} ${counter}`;
      }
    }
  }

  addParticipant(participantTemplate: Participant) {
    const encounterParticipant = {
      id: guid(),
      owner: this.authService.user.uid,
      type: participantTemplate.type,
      name: this.findNameWithNo(participantTemplate.name),
      color: participantTemplate.color,
      initiative: null,
      initiativeModifier: participantTemplate.initiativeModifier,
      currentHp: participantTemplate.maxHp,
      maxHp: participantTemplate.maxHp,
      temporaryHp: 0,
      armorClass: participantTemplate.armorClass,
      speed: participantTemplate.speed,
      vulnerabilityIds: [...participantTemplate.vulnerabilityIds],
      immunityIds: [...participantTemplate.immunityIds],
      resistanceIds: [...participantTemplate.resistanceIds],
      conditionIds: [],
      comments: participantTemplate.comments,
      advantages: null
    };

    if (participantTemplate.type === ParticipantType.Player) {
      this.addedPlayers.push(encounterParticipant);
    } else {
      this.addedMonsters.push(encounterParticipant);
    }
  }

  deletePlayer(player: EncounterParticipant) {
    this.addedPlayers = this.addedPlayers.filter(value => value.id !== player.id);
  }

  deleteMonster(monster: EncounterParticipant) {
    this.addedMonsters = this.addedMonsters.filter(value => value.id !== monster.id);
  }

  changeMonster(monster: EncounterParticipant) {
    this.addedMonsters.splice(this.addedMonsters.findIndex(item => item.id === monster.id), 1, monster);
  }

  changePlayer(player: EncounterParticipant) {
    this.addedPlayers.splice(this.addedPlayers.findIndex(item => item.id === player.id), 1, player);
  }

  generateInitiatives() {
    for (const player of this.addedPlayers) {
      this.generateInitiative(player);
    }

    for (const monster of this.addedMonsters) {
      this.generateInitiative(monster);
    }
  }

  generateInitiative(participant: EncounterParticipant) {
    if (participant.initiative === null) {
      participant.initiative = Math.ceil(Math.random() * 20);
    }
  }
}
