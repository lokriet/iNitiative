import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { guid } from '@datorama/akita';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/state/auth.service';
import { MessageService } from 'src/app/messages/state/message.service';
import { ConditionsQuery } from 'src/app/setup/state/conditions/conditions.query';
import { DamageTypeQuery } from 'src/app/setup/state/damage-type/damage-type.query';
import { Participant, ParticipantType } from 'src/app/setup/state/participants/participant.model';
import { ParticipantQuery } from 'src/app/setup/state/participants/participant.query';

import { EncounterParticipant } from '../encounter-participant/state/encounter-participant.model';
import { EncounterParticipantQuery } from '../encounter-participant/state/encounter-participant.query';
import { EncounterParticipantService } from '../encounter-participant/state/encounter-participant.service';
import { EncounterQuery } from '../state/encounter.query';
import { EncounterService } from '../state/encounter.service';
import { faDiceD6, faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-encounter-edit',
  templateUrl: './encounter-edit.component.html',
  styleUrls: ['./encounter-edit.component.scss']
})
export class EncounterEditComponent implements OnInit {
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

  addedParticipantsNoByTypeId: Map<string, number> = new Map();

  activeTemlateTab = 'players';

  constructor(private encounterService: EncounterService,
              private encounterQuery: EncounterQuery,
              private participantTemplateQuery: ParticipantQuery,
              private encounterParticipantsQuery: EncounterParticipantQuery,
              private encounterParticipantsService: EncounterParticipantService,
              private damageTypesQuery: DamageTypeQuery,
              private conditionsQuery: ConditionsQuery,
              private authService: AuthService,
              private messageService: MessageService,
              private router: Router) { }

  ngOnInit() {
    this.encountersLoading$ = this.encounterQuery.selectLoading();
    this.participantTemplatesLoading$ = this.participantTemplateQuery.selectLoading();
    this.participantsLoading$ = this.encounterParticipantsQuery.selectLoading();
    this.damageTypesLoading$ = this.damageTypesQuery.selectLoading();
    this.conditionsLoading$ = this.conditionsQuery.selectLoading();
  }

  onSubmitForm(startPlaying: boolean) {
    const existingName = this.encounterQuery.getAll({filterBy: encounter => encounter.name === this.encounterName});
    if (existingName != null && existingName.length > 0) {
      this.errorMessage = 'Encounter with this name already exists. Choose another one';
      return;
    }

    const currentDate = new Date();

    for (const player of this.addedPlayers) {
      this.encounterParticipantsService.add(player);
    }
    for (const monster of this.addedMonsters) {
      this.encounterParticipantsService.add(monster);
    }

    const newEncounter = {
      id: guid(),
      owner: this.authService.user.uid,
      name: this.encounterName,
      participantIds: [...this.addedPlayers.map(player => player.id), ...this.addedMonsters.map(monster => monster.id)],
      createdDate: currentDate.getTime(),
      lastModifiedDate: currentDate.getTime()
    };

    this.encounterService.add(newEncounter).then(value => {
      this.messageService.addInfo(`Yay, encounter ${this.encounterName} created!`);

      if (startPlaying) {
        this.router.navigate(['encounters', 'play', newEncounter.id]);
      } else {
        this.router.navigate(['encounters']);
      }
    });
  }

  addParticipant(participantTemplate: Participant) {
    let name = participantTemplate.name;
    let count = this.addedParticipantsNoByTypeId.get(participantTemplate.id);

    if (count != null) {
      name = `${name} ${count}`;
      count++;
    } else {
      count = 1;
    }

    const encounterParticipant = {
      id: guid(),
      owner: this.authService.user.uid,
      type: participantTemplate.type,
      name,
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
      comments: participantTemplate.comments
    };

    if (participantTemplate.type === ParticipantType.Player) {
      this.addedPlayers.push(encounterParticipant);
    } else {
      this.addedMonsters.push(encounterParticipant);
    }
    this.addedParticipantsNoByTypeId.set(participantTemplate.id, count);
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

  isTemplateTabActive(tabName: string) {
    return this.activeTemlateTab === tabName;
  }

  setTemplateTabActive(tabName: string) {
    this.activeTemlateTab = tabName;
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
