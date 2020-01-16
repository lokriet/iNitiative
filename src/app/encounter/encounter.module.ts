import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SetupModule } from '../setup/setup.module';
import { SharedModule } from '../shared/shared.module';
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
import { MapComponent } from './encounter-play/map/map.component';
import { SelectImmunitiesListComponent } from './encounter-play/select-immunities-list/select-immunities-list.component';
import { SelectListComponent } from './encounter-play/select-list/select-list.component';
import { EncounterRoutingModule } from './encounter-routing.module';
import { EncountersListComponent } from './encounters-list/encounters-list.component';
import { AddParticipantsViewComponent } from './participant-templates/add-participants-view/add-participants-view.component';
import { ParticipantTemplateComponent } from './participant-templates/participant-template/participant-template.component';
import {
  ParticipantTemplatesListComponent,
} from './participant-templates/participant-templates-list/participant-templates-list.component';
import { ToDatePipe } from './to-date.pipe';

@NgModule({
  declarations: [
    EncountersListComponent,
    EncounterEditComponent,
    ToDatePipe,
    EncounterParticipantComponent,
    EncounterParticipantsListComponent,
    ParticipantTemplatesListComponent,
    ParticipantTemplateComponent,
    EncounterParticipantEditComponent,
    EncounterPlayComponent,
    AddParticipantsViewComponent,
    SetupAddedParticipantsViewComponent,
    SelectListComponent,
    SelectImmunitiesListComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    SharedModule,
    SetupModule,
    EncounterRoutingModule
  ]
})
export class EncounterModule { }
