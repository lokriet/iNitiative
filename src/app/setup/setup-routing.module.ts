import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticipantsSetupComponent } from './participants-setup/participants-setup.component';
import { DamageTypeEditComponent } from './damage-type-setup/damage-type-edit/damage-type-edit.component';
import { DamageTypeSetupComponent } from './damage-type-setup/damage-type-setup.component';
import { DamageTypeGuard } from './state/damage-type/damage-type.guard';
import { ParticipantEditComponent } from './participants-setup/participant-edit/participant-edit.component';
import { ParticipantGuard } from './state/participants/participant.guard';
import { ConditionsSetupComponent } from './conditions-setup/conditions-setup.component';
import { ConditionGuard } from './state/conditions/condition.guard';


const setupRoutes: Routes = [
  {
    path: 'setup-participants',
    component: ParticipantsSetupComponent,
    canActivate: [DamageTypeGuard, ParticipantGuard],
    canDeactivate: [DamageTypeGuard, ParticipantGuard]
  },
  {
    path: 'setup-participants/new',
    component: ParticipantEditComponent,
    canActivate: [DamageTypeGuard, ParticipantGuard],
    canDeactivate: [DamageTypeGuard, ParticipantGuard]
  },
  {
    path: 'setup-damage-types',
    component: DamageTypeSetupComponent,
    canActivate: [DamageTypeGuard],
    canDeactivate: [DamageTypeGuard]
  },
  {
    path: 'setup-damage-types/new',
    component: DamageTypeEditComponent
  },
  {
    path: 'setup-conditions',
    component: ConditionsSetupComponent,
    canActivate: [ConditionGuard],
    canDeactivate: [ConditionGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(setupRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SetupRoutingModule {}
