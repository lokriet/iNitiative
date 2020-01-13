import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { guid } from '@datorama/akita';
import { faCheck, faCog, faPlay, faPlus, faSkull, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Observable, of, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/state/auth.service';
import { MessageService } from 'src/app/messages/state/message.service';
import { Condition } from 'src/app/setup/state/conditions/condition.model';
import { ConditionsQuery } from 'src/app/setup/state/conditions/conditions.query';
import { ConditionsService } from 'src/app/setup/state/conditions/conditions.service';
import { DamageType, DamageTypeType } from 'src/app/setup/state/damage-type/damage-type.model';
import { DamageTypeQuery } from 'src/app/setup/state/damage-type/damage-type.query';
import { DamageTypeService } from 'src/app/setup/state/damage-type/damage-type.service';
import { Feature } from 'src/app/setup/state/features/feature.model';
import { FeatureQuery } from 'src/app/setup/state/features/feature.query';
import { Participant } from 'src/app/setup/state/participants/participant.model';
import { ParticipantQuery } from 'src/app/setup/state/participants/participant.query';

import { EncounterParticipant } from '../encounter-participant/state/encounter-participant.model';
import { EncounterParticipantQuery } from '../encounter-participant/state/encounter-participant.query';
import { EncounterParticipantService } from '../encounter-participant/state/encounter-participant.service';
import { Encounter } from '../state/encounter.model';
import { EncounterQuery } from '../state/encounter.query';
import { EncounterService } from '../state/encounter.service';


enum EditingField {
  Vulnerabilities = 'vulnerabilities',
  Immunities = 'immunities',
  Resistances = 'resistances',
  Conditions = 'conditions'
}

@Component({
  selector: 'app-encounter-play',
  templateUrl: './encounter-play.component.html',
  styleUrls: ['./encounter-play.component.scss']
})
export class EncounterPlayComponent implements OnInit, OnDestroy {
  activeParticpantIcon = faPlay;
  faCheck = faCheck;
  skullIcon = faSkull;
  editIcon = faCog;
  deleteIcon = faTimes;
  addIcon = faPlus;

  encountersLoading$: Observable<boolean>;
  participantTemplatesLoading$: Observable<boolean>;
  participantsLoading$: Observable<boolean>;
  damageTypesLoading$: Observable<boolean>;
  conditionsLoading$: Observable<boolean>;
  featuresLoading$: Observable<boolean>;

  allParticipants$: Observable<EncounterParticipant[]>;
  allConditions$: Observable<Condition[]>;
  allDamageTypes$: Observable<DamageType[]>;
  allFeatures$: Observable<Feature[]>;

  sub: Subscription;
  encounter: Encounter;
  activeParticipantId: string = null;

  newConditionColor: string = null;
  newConditionName: string = null;
  newConditionDescription: string = null;

  newDamageTypeColor: string = null;
  newDamageTypeName: string = null;
  newDamageTypeType = DamageTypeType.DamageType;

  editingParticipantId: string = null;
  editingField: EditingField = null;

  summonedParticipant: EncounterParticipant = null;

  constructor(private encounterService: EncounterService,
              private encounterQuery: EncounterQuery,
              private participantTemplateQuery: ParticipantQuery,
              private encounterParticipantsQuery: EncounterParticipantQuery,
              private encounterParticipantsService: EncounterParticipantService,
              private damageTypesQuery: DamageTypeQuery,
              private featuresQuery: FeatureQuery,
              private damageTypesService: DamageTypeService,
              private conditionsQuery: ConditionsQuery,
              private conditionsService: ConditionsService,
              private authService: AuthService,
              private messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute) { }


  participantsFilter = (item) => {
    if (item.owner !== this.authService.user.uid) {
      return false;
    }

    if (this.encounter.participantIds) {
      if (this.encounter.participantIds.includes(item.id)) {
        return true;
      }
    }

    return false;
  }

  partisipantsSort = (a, b) => (b.initiative + b.initiativeModifier) - (a.initiative + a.initiativeModifier);

  ngOnInit() {
    this.encountersLoading$ = this.encounterQuery.selectLoading();
    this.participantTemplatesLoading$ = this.participantTemplateQuery.selectLoading();
    this.participantsLoading$ = this.encounterParticipantsQuery.selectLoading();
    this.damageTypesLoading$ = this.damageTypesQuery.selectLoading();
    this.conditionsLoading$ = this.conditionsQuery.selectLoading();
    this.featuresLoading$ = this.featuresQuery.selectLoading();

    this.sub = this.route.params.subscribe(
      (params: Params) => {
        const encounterId = params.id;
        if (!encounterId) {
          this.router.navigate(['404']);
        }

        this.encounter = this.encounterQuery.getEntity(encounterId);
        if (!this.encounter || this.encounter.owner !== this.authService.user.uid) {
          this.router.navigate(['404']);
        }

        this.encounterQuery.selectEntity(encounterId).subscribe(value => {
          this.encounter = value;
          this.activeParticipantId = this.encounter.activeParticipantId;
        });

        this.allParticipants$ = this.encounterParticipantsQuery.selectAll({
          filterBy: this.participantsFilter,
          sortBy: this.partisipantsSort
        });
      }
    );

    this.allConditions$ = this.conditionsQuery.selectAll({
      filterBy: item => item.owner === this.authService.user.uid,
      sortBy: 'name'
    });

    this.allFeatures$ = this.featuresQuery.selectAll({
      filterBy: item => item.owner === this.authService.user.uid,
      sortBy: 'name'
    });

    this.allDamageTypes$ = this.damageTypesQuery.selectAll({
      filterBy: item => item.owner === this.authService.user.uid,
      sortBy: 'name'
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  isActive(participant) {
    return participant.id === this.encounter.activeParticipantId;
  }

  isDead(participant) {
    return participant.currentHp <= 0;
  }

  removeDeadParticipant(participant) {
    if (this.isDead(participant)) {
      if (this.activeParticipantId === participant.id) {
        this.nextMove();
      }

      const newParticipants = this.encounter.participantIds.filter(item => item !== participant.id);
      this.encounterService.update({...this.encounter, participantIds: newParticipants, activeParticipantId: this.activeParticipantId});
      this.encounterParticipantsService.remove(participant.id);
    }
  }

  getConditions(conditionIds: string[]) {
    if (!conditionIds || conditionIds.length === 0) {
      return of([]);
    }
    return this.conditionsQuery.selectAll({
      filterBy: item => conditionIds.includes(item.id),
      sortBy: 'name'
    });
  }

  getUnselectedConditions(allConditions, participantConditionIds) {
    if (participantConditionIds && participantConditionIds.length > 0) {
      return allConditions.filter(item => !participantConditionIds.includes(item.id));
    } else {
      return allConditions;
    }
  }

  onDeleteCondition(participant: EncounterParticipant, conditionId: string) {
    const conditionIds = [...participant.conditionIds].filter(item => item !== conditionId);
    this.encounterParticipantsService.update({...participant, conditionIds});
  }

  onAddConditions(participant: EncounterParticipant, conditionIds: string[]) {
    if (conditionIds && conditionIds.length > 0) {
      this.encounterParticipantsService.update({...participant, conditionIds: [...participant.conditionIds, ...conditionIds]});
    }
  }

  onDeleteImmunity(participant: EncounterParticipant, immunityId: string) {
    const immunityIds = [...participant.immunityIds].filter(item => item !== immunityId);
    this.encounterParticipantsService.update({...participant, immunityIds});
  }

  onAddImmunities(participant: EncounterParticipant, immunityIds: string[]) {
    if (immunityIds && immunityIds.length > 0) {
      this.encounterParticipantsService.update({...participant, immunityIds: [...participant.immunityIds, ...immunityIds]});
    }
  }

  getDamageTypes(damageTypeIds: string[]) {
    if (!damageTypeIds || damageTypeIds.length === 0) {
      return of([]);
    }
    return this.damageTypesQuery.selectAll({
      filterBy: item => damageTypeIds.includes(item.id),
      sortBy: 'name'
    });
  }

  getUnselectedDamageTypes(allDamageTypes, selectedDamageTypeIds) {
    if (selectedDamageTypeIds && selectedDamageTypeIds.length > 0) {
      return allDamageTypes.filter(item => !selectedDamageTypeIds.includes(item.id));
    } else {
      return allDamageTypes;
    }
  }

  getFeatures(featureIds: string[]) {
    if (!featureIds || featureIds.length === 0) {
      return of([]);
    }
    return this.featuresQuery.selectAll({
      filterBy: item => featureIds.includes(item.id),
      sortBy: 'name'
    });
  }

  nextMove() {
    const participants = this.encounterParticipantsQuery.getAll({
      filterBy: this.participantsFilter,
      sortBy: this.partisipantsSort
    });

    let activeParticipantId = null;
    if (this.encounter.activeParticipantId == null) {
      activeParticipantId = participants[0].id;
    } else {
      const currentIndex = participants.findIndex(item => item.id === this.encounter.activeParticipantId);
      if (currentIndex === -1) {
        console.log(':(');
      } else {
        const nextIndex = (currentIndex + 1) % participants.length;
        activeParticipantId = participants[nextIndex].id;
      }
    }

    this.activeParticipantId = activeParticipantId;
    this.encounterService.update({...this.encounter, activeParticipantId});
  }

  changeHp(participant: EncounterParticipant, dmgValue: number, heal: boolean) {
    if (dmgValue == null || dmgValue <= 0 ) {
      return;
    }

    let temp = participant.temporaryHp;
    let currentHp = participant.currentHp;

    if (!heal) {
      let remainingDmg = dmgValue;
      if (temp != null && temp > 0) {
        if (dmgValue > temp) {
          remainingDmg -= temp;
          temp = null;
        } else {
          temp -= remainingDmg;
          remainingDmg = 0;
        }
      }
      currentHp = Math.max(0, currentHp - remainingDmg);
    } else {
      currentHp = Math.min(participant.maxHp, currentHp + dmgValue);
    }

    this.encounterParticipantsService.update({ ...participant, currentHp, temporaryHp: temp });
  }

  changeTempHp(participant: EncounterParticipant, temporaryHp: number) {
    this.encounterParticipantsService.update({ ...participant, temporaryHp });
  }

  changeCurrentHp(participant: EncounterParticipant, currentHp: number) {
    this.encounterParticipantsService.update({ ...participant, currentHp });
  }

  changeMaxHp(participant: EncounterParticipant, maxHp: number) {
    this.encounterParticipantsService.update({ ...participant, maxHp });
  }

  changeAdvantages(participant: EncounterParticipant, advantages: string) {
    if (participant.advantages !== advantages) {
      this.encounterParticipantsService.update({ ...participant, advantages });
    }
  }

  changeComments(participant: EncounterParticipant, comments: string) {
    if (participant.comments !== comments) {
      this.encounterParticipantsService.update({ ...participant, comments });
    }
  }

  changeConditions(participant: EncounterParticipant, conditionIds: string[]) {
    this.encounterParticipantsService.update({ ...participant, conditionIds });
  }

  changeFeatures(participant: EncounterParticipant, featureIds: string[]) {
    this.encounterParticipantsService.update({ ...participant, featureIds });
  }

  changeVulnerabilities(participant: EncounterParticipant, vulnerabilityIds: string[]) {
    this.encounterParticipantsService.update({ ...participant, vulnerabilityIds });
  }

  changeResistances(participant: EncounterParticipant, resistanceIds: string[]) {
    this.encounterParticipantsService.update({ ...participant, resistanceIds });
  }

  changeImmunities(participant: EncounterParticipant, immunityIds: string[]) {
    this.encounterParticipantsService.update({ ...participant, immunityIds });
  }

  setTmpArmorClass(participant: EncounterParticipant, temporaryArmorClass: number) {
    this.encounterParticipantsService.update({ ...participant, temporaryArmorClass });
  }

  setTmpSpeed(participant: EncounterParticipant, temporarySpeed: number) {
    this.encounterParticipantsService.update({ ...participant, temporarySpeed });
  }

  addNewCondition() {
    if (this.newConditionName == null) {
      return;
    }

    this.conditionsService.add({
      id: guid(),
      owner: this.authService.user.uid,
      color: this.newConditionColor,
      name: this.newConditionName,
      description: this.newConditionDescription
    });

    this.newConditionColor = null;
    this.newConditionName = null;
  }

  addNewDamageType() {
    if (this.newDamageTypeName == null) {
      return;
    }

    this.damageTypesService.add({
      id: guid(),
      owner: this.authService.user.uid,
      color: this.newDamageTypeColor,
      name: this.newDamageTypeName,
      type: this.newDamageTypeType
    });

    this.newDamageTypeColor = null;
    this.newDamageTypeName = null;
    this.newDamageTypeType = DamageTypeType.DamageType;
  }

  addSummonToTheGame() {
    this.encounterService.update({...this.encounter,
      participantIds: [...this.encounter.participantIds, this.summonedParticipant.id] });

    this.encounterParticipantsService.add(this.summonedParticipant);

    this.summonedParticipant = null;
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
      temporaryArmorClass: null,
      speed: participantTemplate.speed,
      temporarySpeed: null,
      vulnerabilityIds: participantTemplate.vulnerabilityIds ? [...participantTemplate.vulnerabilityIds] : [],
      immunityIds: participantTemplate.immunityIds ? [...participantTemplate.immunityIds] : [],
      resistanceIds: participantTemplate.resistanceIds ? [...participantTemplate.resistanceIds] : [],
      featureIds: participantTemplate.featureIds ? [...participantTemplate.featureIds] : [],
      conditionIds: [],
      comments: participantTemplate.comments,
      advantages: null
    };

    this.summonedParticipant = encounterParticipant;
  }

  findNameWithNo(name: string): string {
    const names = this.encounterParticipantsQuery.getAll({
      filterBy: this.participantsFilter
    }).map(item => item.name);

    let counter = 0;
    let nextName = name;
    while (true) {
      if (names.indexOf(nextName) === -1 &&
          names.indexOf(nextName) === -1) {
        return nextName;
      } else {
        counter++;
        nextName = `${name} ${counter}`;
      }
    }
  }

  onEditField(participantId, fieldName) {
    this.editingParticipantId = participantId;
    this.editingField = fieldName;
  }

  onSaveField() {
    this.editingParticipantId = null;
    this.editingField = null;
  }


  hasMissingInitiatives() {
    let hasMissingInitiatives = false;
    const participants = this.encounterParticipantsQuery.getAll({
      filterBy: this.participantsFilter,
      sortBy: this.partisipantsSort
    });

    for (const participant of participants) {
      if (participant.initiative == null) {
        hasMissingInitiatives = true;
        break;
      }
    }

    return hasMissingInitiatives;
  }

  generateMissingInitiatives() {
    const participants = this.encounterParticipantsQuery.getAll({
      filterBy: this.participantsFilter,
      sortBy: this.partisipantsSort
    });

    for (const participant of participants) {
      if (participant.initiative == null) {
        const initiative = Math.ceil(Math.random() * 20);
        this.encounterParticipantsService.update({...participant, initiative});
      }
    }
  }
}
