import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ParticipantGuard } from '../setup/state/participants/participant.guard';
import { EncounterEditComponent } from './encounter-edit/encounter-edit.component';
import { EncountersListComponent } from './encounters-list/encounters-list.component';
import { EncounterGuard } from './state/encounter.guard';
import { DamageTypeGuard } from '../setup/state/damage-type/damage-type.guard';
import { ConditionGuard } from '../setup/state/conditions/condition.guard';
import { EncounterParticipantGuard } from './encounter-participant/state/encounter-participant.guard';
import { EncounterPlayComponent } from './encounter-play/encounter-play.component';
import { AuthGuard } from '../auth/auth.guard';

const encounterRoutes: Routes = [
  { 
    path: 'encounters',
    component: EncountersListComponent,
    canActivate: [EncounterGuard, AuthGuard],
    canDeactivate: [EncounterGuard]
  },
  {
    path: 'encounters/new',
    component: EncounterEditComponent,
    canActivate: [EncounterGuard, ParticipantGuard, DamageTypeGuard, ConditionGuard, EncounterParticipantGuard, AuthGuard],
    canDeactivate: [EncounterGuard, ParticipantGuard, DamageTypeGuard, ConditionGuard, EncounterParticipantGuard]
  },
  {
    path: 'encounters/edit/:id',
    component: EncounterEditComponent,
    canActivate: [EncounterGuard, ParticipantGuard, DamageTypeGuard, ConditionGuard, EncounterParticipantGuard, AuthGuard],
    canDeactivate: [EncounterGuard, ParticipantGuard, DamageTypeGuard, ConditionGuard, EncounterParticipantGuard]
  },
  {
    path: 'encounters/play/:id',
    component: EncounterPlayComponent,
    canActivate: [EncounterGuard, ParticipantGuard, DamageTypeGuard, ConditionGuard, EncounterParticipantGuard, AuthGuard],
    canDeactivate: [EncounterGuard, ParticipantGuard, DamageTypeGuard, ConditionGuard, EncounterParticipantGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(encounterRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class EncounterRoutingModule {}
