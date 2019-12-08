import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncountersListComponent } from './encounters-list/encounters-list.component';
import { EncounterEditComponent } from './encounter-edit/encounter-edit.component';
import { EncounterViewComponent } from './encounter-view/encounter-view.component';
import { EncounterRoutingModule } from './encounter-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ToDatePipe } from './to-date.pipe';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { EncounterParticipantComponent } from './encounter-participant/encounter-participant.component';

@NgModule({
  declarations: [
    EncountersListComponent,
    EncounterEditComponent,
    EncounterViewComponent,
    ToDatePipe,
    EncounterParticipantComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EncounterRoutingModule
  ]
})
export class EncounterModule { }
