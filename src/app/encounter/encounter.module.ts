import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SetupModule } from '../setup/setup.module';
import { SharedModule } from '../shared/shared.module';
import { AddParticipantsViewComponent } from './add-participants-view/add-participants-view.component';
import { EncounterEditComponent } from './encounter-edit/encounter-edit.component';
import {
  EncounterParticipantEditComponent,
} from './encounter-participant/encounter-participant-edit/encounter-participant-edit.component';
import { EncounterParticipantComponent } from './encounter-participant/encounter-participant.component';
import {
  EncounterParticipantsListComponent,
} from './encounter-participant/encounter-participants-list/encounter-participants-list.component';
import {
  SetupAddedParticipantsViewComponent,
} from './encounter-participant/setup-added-participants-view/setup-added-participants-view.component';
import { EncounterPlayComponent } from './encounter-play/encounter-play.component';
import { EncounterRoutingModule } from './encounter-routing.module';
import { EncounterViewComponent } from './encounter-view/encounter-view.component';
import { EncountersListComponent } from './encounters-list/encounters-list.component';
import {
  ParticipantTemplateComponent,
} from './participant-templates-list/participant-template/participant-template.component';
import { ParticipantTemplatesListComponent } from './participant-templates-list/participant-templates-list.component';
import { ToDatePipe } from './to-date.pipe';

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
    AddParticipantsViewComponent,
    SetupAddedParticipantsViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SetupModule,
    EncounterRoutingModule
  ]
})
export class EncounterModule { }
