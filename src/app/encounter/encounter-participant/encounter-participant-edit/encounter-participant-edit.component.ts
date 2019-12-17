import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faCheck, faChevronRight, faDiceD6, faTimes, faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/state/auth.service';
import { Condition } from 'src/app/setup/state/conditions/condition.model';
import { ConditionsQuery } from 'src/app/setup/state/conditions/conditions.query';
import { DamageType } from 'src/app/setup/state/damage-type/damage-type.model';
import { DamageTypeQuery } from 'src/app/setup/state/damage-type/damage-type.query';
import { Feature } from 'src/app/setup/state/features/feature.model';
import { FeatureQuery } from 'src/app/setup/state/features/feature.query';

import { EncounterParticipant } from '../state/encounter-participant.model';

@Component({
  selector: 'app-encounter-participant-edit',
  templateUrl: './encounter-participant-edit.component.html',
  styleUrls: ['./encounter-participant-edit.component.scss'],
  animations: [
    trigger('collapse', [
      state('collapsed', style({ height: '0px', borderColor: 'transparent' })),
      state('expanded', style({ height: '*', borderColor: '*' })),
      transition('collapsed <=> expanded', [animate('200ms')])
    ])
  ]
})
export class EncounterParticipantEditComponent implements OnInit {
  @Input() participant: EncounterParticipant;
  @Output() changesSaved = new EventEmitter<EncounterParticipant>();
  @Output() changesCancelled = new EventEmitter<null>();

  faRight = faChevronRight;
  deleteIcon = faTimes;
  d20Icon = faDiceD6;
  saveIcon = faCheck;
  cancelIcon = faUndoAlt;

  @Input() expanded = false;
  @Output() expandedChanged = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<null>();


  color: string;
  name: string;
  initiative: number;
  initiativeModifier: number;
  currentHp: number;
  maxHp: number;
  temporaryHp: number;
  armorClass: number;
  speed: number;
  vulnerabilities: string[];
  immunities: string[] = [];
  resistances: string[] = [];
  conditions: string[] = [];
  features: string[] = [];
  comments: string;


  allDamageTypes$: Observable<DamageType[]>;
  allConditions$: Observable<Condition[]>;
  allFeatures$: Observable<Feature[]>;

  constructor(private damageTypeQuery: DamageTypeQuery,
              private conditionsQuery: ConditionsQuery,
              private featureQuery: FeatureQuery,
              private authService: AuthService) { }

  ngOnInit() {
    this.color = this.participant.color;
    this.name = this.participant.name;
    this.initiative = this.participant.initiative;
    this.initiativeModifier = this.participant.initiativeModifier;
    this.currentHp = this.participant.currentHp;
    this.maxHp = this.participant.maxHp;
    this.temporaryHp = this.participant.temporaryHp;
    this.armorClass = this.participant.armorClass;
    this.speed = this.participant.speed;
    this.comments = this.participant.comments;

    if (this.participant.conditionIds) {
      this.conditions = [...this.participant.conditionIds];
    }
    if (this.participant.vulnerabilityIds) {
      this.vulnerabilities = [...this.participant.vulnerabilityIds];
    }
    if (this.participant.immunityIds) {
      this.immunities = [...this.participant.immunityIds];
    }
    if (this.participant.resistanceIds) {
      this.resistances = [...this.participant.resistanceIds];
    }
    if (this.participant.featureIds) {
      this.features = [...this.participant.featureIds];
    }


    this.allDamageTypes$ = this.damageTypeQuery.selectAll({
      filterBy: item => {
        if (item.owner !== this.authService.user.uid) {
          return false;
        }
        return true;
      },
      sortBy: 'name'
    });

    this.allConditions$ = this.conditionsQuery.selectAll({
      filterBy: item => {
        if (item.owner !== this.authService.user.uid) {
          return false;
        }
        return true;
      },
      sortBy: 'name'
    });

    this.allFeatures$ = this.featureQuery.selectAll({
      filterBy: item => {
        if (item.owner !== this.authService.user.uid) {
          return false;
        }
        return true;
      },
      sortBy: 'name'
    });
  }

  switchExpanded() {
    this.expanded = !this.expanded;
    this.expandedChanged.emit(this.expanded);
  }

  getDamageType(damageTypeId: string): DamageType {
    return this.damageTypeQuery.getEntity(damageTypeId);
  }

  getCondition(conditionId: string): Condition {
    return this.conditionsQuery.getEntity(conditionId);
  }

  getFeature(featureId: string): Feature {
    return this.featureQuery.getEntity(featureId);
  }

  deleteParticipant() {
    this.delete.emit();
  }

  rollInitiative() {
    this.initiative = Math.ceil(Math.random() * 20);
  }

  cancelEdit() {
    this.changesCancelled.emit();
  }

  applyChanges() {
    const newParticipant = {
      id: this.participant.id,
      owner: this.participant.owner,
      type: this.participant.type,
      color: this.color,
      name: this.name,
      initiative: this.initiative,
      initiativeModifier: this.initiativeModifier,
      currentHp: this.currentHp,
      maxHp: this.maxHp,
      temporaryHp: this.temporaryHp,
      armorClass: this.armorClass,
      temporaryArmorClass: this.participant.temporaryArmorClass || null,
      speed: this.speed,
      temporarySpeed: this.participant.temporarySpeed || null,
      vulnerabilityIds: this.vulnerabilities,
      resistanceIds: this.resistances,
      immunityIds: this.immunities,
      conditionIds: this.conditions,
      featureIds: this.features,
      comments: this.comments,
      advantages: null
    };

    this.changesSaved.emit(newParticipant);
  }
}
