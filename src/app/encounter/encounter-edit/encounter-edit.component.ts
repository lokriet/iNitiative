import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { guid } from '@datorama/akita';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/state/auth.service';
import { MessageService } from 'src/app/messages/state/message.service';
import { Participant, ParticipantType } from 'src/app/setup/state/participants/participant.model';

import { EncounterQuery } from '../state/encounter.query';
import { EncounterService } from '../state/encounter.service';
import { EncounterParticipant } from '../encounter-participant/state/encounter-participant.model';
import { ParticipantQuery } from 'src/app/setup/state/participants/participant.query';
import { EncounterParticipantQuery } from '../encounter-participant/state/encounter-participant.query';
import { DamageTypeQuery } from 'src/app/setup/state/damage-type/damage-type.query';
import { ConditionsQuery } from 'src/app/setup/state/conditions/conditions.query';
import { EncounterParticipantService } from '../encounter-participant/state/encounter-participant.service';

@Component({
  selector: 'app-encounter-edit',
  templateUrl: './encounter-edit.component.html',
  styleUrls: ['./encounter-edit.component.scss']
})
export class EncounterEditComponent implements OnInit, OnDestroy {
  encountersLoading$: Observable<boolean>;
  participantTemplatesLoading$: Observable<boolean>;
  participantsLoading$: Observable<boolean>;
  damageTypesLoading$: Observable<boolean>;
  conditionsLoading$: Observable<boolean>;

  encounterName: string;
  errorMessage: string = null;

  monsterTemplates$: Observable<Participant[]>;
  playerTemplates$: Observable<Participant[]>;

  addedPlayers: EncounterParticipant[] = [];
  addedMonsters: EncounterParticipant[] = [];

  monstersDropdown = [];

  playersFilter: string;

  addedParticipantsNoByTypeId: Map<string, number> = new Map();

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

    this.monsterTemplates$ = this.selectParticipantTemplates(ParticipantType.Monster, null);
    this.playerTemplates$ = this.selectParticipantTemplates(ParticipantType.Player, null);


  }

  selectParticipantTemplates(type: ParticipantType, filter: string) {
    return this.participantTemplateQuery.selectAll({filterBy: item => {
      if (item.owner !== this.authService.user.uid) {
        return false;
      }

      if (item.type !== type) {
        return false;
      }

      if (filter && filter.length > 0 && !item.name.toLowerCase().includes(filter.toLowerCase())) {
        return false;
      }

      return true;
    }});
  }

  ngOnDestroy() {
  }

  onSubmitForm() {
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
    this.encounterService.add({
      id: guid(),
      owner: this.authService.user.uid,
      name: this.encounterName,
      participantIds: [...this.addedPlayers.map(player => player.id), ...this.addedMonsters.map(monster => monster.id)],
      createdDate: currentDate.getTime(),
      lastModifiedDate: currentDate.getTime()
    }).then(value => {
      this.messageService.addInfo(`Yay, encounter ${this.encounterName} created!`);
      this.router.navigate(['encounters']);
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
      initiative: 0,
      initiativeModifier: participantTemplate.initiativeModifier,
      currenthp: participantTemplate.maxHp,
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

  deletePlayer(i: number) {
    this.addedPlayers.splice(i, 1);
  }

  deleteMonster(i: number) {
    this.addedMonsters.splice(i, 1);
  }

  playersFilterChanged(filterValue: string) {
    this.playersFilter = filterValue;
    this.playerTemplates$ = this.selectParticipantTemplates(ParticipantType.Player, this.playersFilter);
  }

  addMonsters() {
    for (let monster of this.monstersDropdown) {
      this.addParticipant(monster);
    }
  }
}
