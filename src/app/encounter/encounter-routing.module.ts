import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EncountersListComponent } from './encounters-list/encounters-list.component';

const encounterRoutes: Routes = [
  { path: 'encounters', component: EncountersListComponent}
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
