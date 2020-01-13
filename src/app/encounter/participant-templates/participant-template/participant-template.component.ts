import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { DamageType } from 'src/app/setup/state/damage-type/damage-type.model';
import { DamageTypeQuery } from 'src/app/setup/state/damage-type/damage-type.query';
import { Participant } from 'src/app/setup/state/participants/participant.model';
import { FeatureQuery } from 'src/app/setup/state/features/feature.query';
import { Feature } from 'src/app/setup/state/features/feature.model';
import { ConditionsQuery } from 'src/app/setup/state/conditions/conditions.query';
import { Condition } from 'src/app/setup/state/conditions/condition.model';

@Component({
  selector: 'app-participant-template',
  templateUrl: './participant-template.component.html',
  styleUrls: ['./participant-template.component.scss'],
  animations: [
    trigger('collapse', [
      state('collapsed', style({ height: '0px', borderColor: 'transparent' })),
      state('expanded', style({ height: '*', borderColor: '*' })),
      transition('collapsed <=> expanded', [animate('200ms')])
    ])
  ]
})
export class ParticipantTemplateComponent implements OnInit {
  faRight = faChevronRight;
  expanded = false;

  @Input() participantTemplate: Participant;
  @Output() added = new EventEmitter<null>();

  constructor(private damageTypeQuery: DamageTypeQuery,
              private conditionQuery: ConditionsQuery,
              private featureQuery: FeatureQuery) { }

  ngOnInit() {
  }

  switchExpanded() {
    this.expanded = !this.expanded;
  }

  addParticipant() {
    this.added.emit();
  }

  getDamageType(damageTypeId: string): DamageType {
    return this.damageTypeQuery.getEntity(damageTypeId);
  }

  getFeature(featureId: string): Feature {
    return this.featureQuery.getEntity(featureId);
  }

  getCondition(conditionId: string): Feature {
    return this.conditionQuery.getEntity(conditionId);
  }

  getImmunity(immunityId: string): any {
    const result = this.damageTypeQuery.getEntity(immunityId);
    if (result) {
      return result;
    } else {
      return this.conditionQuery.getEntity(immunityId);
    }
  }
}
