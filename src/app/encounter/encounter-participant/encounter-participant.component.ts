import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faChevronRight, faCog, faTimes, faDiceD6 } from '@fortawesome/free-solid-svg-icons';
import { DamageType } from 'src/app/setup/state/damage-type/damage-type.model';
import { DamageTypeQuery } from 'src/app/setup/state/damage-type/damage-type.query';

import { EncounterParticipant } from './state/encounter-participant.model';
import { ConditionsQuery } from 'src/app/setup/state/conditions/conditions.query';
import { Condition } from 'src/app/setup/state/conditions/condition.model';

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
              private conditionsQuery: ConditionsQuery) { }

  ngOnInit() {
  }

  switchExpanded() {
    this.expanded = !this.expanded;
  }

  getDamageType(damageTypeId: string): DamageType {
    return this.damageTypeQuery.getEntity(damageTypeId);
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
