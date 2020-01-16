import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { ConditionGuard } from '../setup/state/conditions/condition.guard';
import { DamageTypeGuard } from '../setup/state/damage-type/damage-type.guard';
import { FeatureGuard } from '../setup/state/features/feature.guard';
import { ParticipantGuard } from '../setup/state/participants/participant.guard';
import { EncounterEditComponent } from './encounter-edit/encounter-edit.component';
import { EncounterParticipantGuard } from './encounter-participant/state/encounter-participant.guard';
import { EncounterPlayComponent } from './encounter-play/encounter-play.component';
import { MapGuard } from './encounter-play/map/state/map.guard';
import { EncountersListComponent } from './encounters-list/encounters-list.component';
import { EncounterGuard } from './state/encounter.guard';

const encounterRoutes: Routes = [
  {
    path: 'encounters',
    component: EncountersListComponent,
    canActivate: [EncounterGuard, EncounterParticipantGuard, ParticipantGuard, MapGuard, AuthGuard],
    canDeactivate: [EncounterGuard, EncounterParticipantGuard, ParticipantGuard, MapGuard]
  },
  {
    path: 'encounters/new',
    component: EncounterEditComponent,
    canActivate: [EncounterGuard, ParticipantGuard, DamageTypeGuard, ConditionGuard, FeatureGuard, EncounterParticipantGuard, AuthGuard],
    canDeactivate: [EncounterGuard, ParticipantGuard, DamageTypeGuard, ConditionGuard, FeatureGuard, EncounterParticipantGuard]
  },
  {
    path: 'encounters/edit/:id',
    component: EncounterEditComponent,
    canActivate: [EncounterGuard, ParticipantGuard, DamageTypeGuard, ConditionGuard, FeatureGuard, EncounterParticipantGuard, AuthGuard],
    canDeactivate: [EncounterGuard, ParticipantGuard, DamageTypeGuard, ConditionGuard, FeatureGuard, EncounterParticipantGuard]
  },
  {
    path: 'encounters/play/:id',
    component: EncounterPlayComponent,
    canActivate: [EncounterGuard, ParticipantGuard, DamageTypeGuard, ConditionGuard, FeatureGuard, EncounterParticipantGuard, MapGuard, AuthGuard],
    canDeactivate: [EncounterGuard, ParticipantGuard, DamageTypeGuard, ConditionGuard, FeatureGuard, EncounterParticipantGuard, MapGuard]
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
