import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticipantsSetupComponent } from './participants-setup/participants-setup.component';


const setupRoutes: Routes = [
  {
    path: 'setup-participants',
    component: ParticipantsSetupComponent
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
