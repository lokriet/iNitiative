import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConditionsSetupComponent } from './conditions-setup/conditions-setup.component';
import { DamageTypeSetupComponent } from './damage-type-setup/damage-type-setup.component';
import { ParticipantsSetupComponent } from './participants-setup/participants-setup.component';
import { SetupRoutingModule } from './setup-routing.module';
import { ParticipantsListComponent } from './participants-setup/participants-list/participants-list.component';
import { ParticipantViewComponent } from './participants-setup/participant-view/participant-view.component';
import { ParticipantEditComponent } from './participants-setup/participant-edit/participant-edit.component';

@NgModule({
  declarations: [
    ConditionsSetupComponent,
    DamageTypeSetupComponent,
    ParticipantsSetupComponent,
    ParticipantsListComponent,
    ParticipantViewComponent,
    ParticipantEditComponent
  ],
  imports: [
    CommonModule,
    SetupRoutingModule
  ]
})
export class SetupModule { }
