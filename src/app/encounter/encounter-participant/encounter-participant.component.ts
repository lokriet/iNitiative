import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faChevronRight, faCog, faDiceD6, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Condition } from 'src/app/setup/state/conditions/condition.model';
import { ConditionsQuery } from 'src/app/setup/state/conditions/conditions.query';
import { DamageType } from 'src/app/setup/state/damage-type/damage-type.model';
import { DamageTypeQuery } from 'src/app/setup/state/damage-type/damage-type.query';
import { FeatureQuery } from 'src/app/setup/state/features/feature.query';

import { EncounterParticipant } from './state/encounter-participant.model';
import { Feature } from 'src/app/setup/state/features/feature.model';

@Component({
  selector: 'app-encounter-participant',
  templateUrl: './encounter-participant.component.html',
  styleUrls: ['./encounter-participant.component.scss'],
  animations: [
    trigger('collapse', [
      state('collapsed', style({ height: '0px', borderColor: 'transparent' })),
      state('expanded', style({ height: '*', borderColor: '*' })),
      transition('collapsed <=> expanded', [animate('200ms')])
    ])
  ]
})
export class EncounterParticipantComponent implements OnInit {
  faRight = faChevronRight;
  tinkerIcon = faCog;
  deleteIcon = faTimes;
  d20Icon = faDiceD6;
  @Input() expanded = false;

  @Input() participant: EncounterParticipant;
  @Output() delete = new EventEmitter<null>();
  @Output() participantChanged = new EventEmitter<EncounterParticipant>();

  editMode = false;

  constructor(private damageTypeQuery: DamageTypeQuery,
              private conditionsQuery: ConditionsQuery,
              private featureQuery: FeatureQuery) { }

  ngOnInit() {
  }

  switchExpanded() {
    this.expanded = !this.expanded;
  }

  getDamageType(damageTypeId: string): DamageType {
    return this.damageTypeQuery.getEntity(damageTypeId);
  }

  getFeature(featureId: string): Feature {
    return this.featureQuery.getEntity(featureId);
  }

  getCondition(conditionId: string): Condition {
    return this.conditionsQuery.getEntity(conditionId);
  }

  deleteParticipant() {
    this.delete.emit();
  }

  rollInitiative() {
    this.participant.initiative = Math.ceil(Math.random() * 20);
  }

  editParticipant() {
    this.editMode = true;
  }

  applyChanges(newParticipant: EncounterParticipant) {
    this.editMode = false;
    this.participantChanged.emit(newParticipant);
  }

  cancelChanges() {
    this.editMode = false;
  }
}
