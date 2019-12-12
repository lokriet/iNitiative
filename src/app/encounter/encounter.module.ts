import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncountersListComponent } from './encounters-list/encounters-list.component';
import { EncounterEditComponent } from './encounter-edit/encounter-edit.component';
import { EncounterViewComponent } from './encounter-view/encounter-view.component';
import { EncounterRoutingModule } from './encounter-routing.module';
import { ToDatePipe } from './to-date.pipe';
import { SharedModule } from '../shared/shared.module';
import { EncounterParticipantComponent } from './encounter-participant/encounter-participant.component';
import { EncounterParticipantsListComponent } from './encounter-participant/encounter-participants-list/encounter-participants-list.component';
import { ParticipantTemplatesListComponent } from './participant-templates-list/participant-templates-list.component';
import { ParticipantTemplateComponent } from './participant-templates-list/participant-template/participant-template.component';
import { EncounterParticipantEditComponent } from './encounter-participant/encounter-participant-edit/encounter-participant-edit.component';
import { SetupModule } from '../setup/setup.module';
import { EncounterPlayComponent } from './encounter-play/encounter-play.component';
import { AddParticipantsViewComponent } from './add-participants-view/add-participants-view.component';

@NgModule({
  declarations: [
    EncountersListComponent,
    EncounterEditComponent,
    EncounterViewComponent,
    ToDatePipe,
    EncounterParticipantComponent,
    EncounterParticipantsListComponent,
    ParticipantTemplatesListComponent,
    ParticipantTemplateComponent,
    EncounterParticipantEditComponent,
    EncounterPlayComponent,
    AddParticipantsViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SetupModule,
    EncounterRoutingModule
  ]
})
export class EncounterModule { }
