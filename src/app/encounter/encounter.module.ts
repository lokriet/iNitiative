import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncountersListComponent } from './encounters-list/encounters-list.component';
import { EncounterEditComponent } from './encounter-edit/encounter-edit.component';
import { EncounterViewComponent } from './encounter-view/encounter-view.component';
import { EncounterRoutingModule } from './encounter-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    EncountersListComponent,
    EncounterEditComponent,
    EncounterViewComponent
  ],
  imports: [
    CommonModule,
    EncounterRoutingModule,
    FontAwesomeModule
  ]
})
export class EncounterModule { }
