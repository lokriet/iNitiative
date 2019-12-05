import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EncounterEditComponent } from './encounter-edit/encounter-edit.component';
import { EncountersListComponent } from './encounters-list/encounters-list.component';
import { EncounterGuard } from './state/encounter.guard';

const encounterRoutes: Routes = [
  { path: 'encounters',
    component: EncountersListComponent,
    canActivate: [EncounterGuard],
    canDeactivate: [EncounterGuard]
  },
  { path: 'encounters/new', component: EncounterEditComponent}
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
