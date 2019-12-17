import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConditionsSetupComponent } from './conditions-setup/conditions-setup.component';
import { DamageTypeSetupComponent } from './damage-type-setup/damage-type-setup.component';
import { ParticipantsSetupComponent } from './participants-setup/participants-setup.component';
import { SetupRoutingModule } from './setup-routing.module';
import { ParticipantsListComponent } from './participants-setup/participants-list/participants-list.component';
import { ParticipantEditComponent } from './participants-setup/participant-edit/participant-edit.component';
import { SharedModule } from '../shared/shared.module';
import { DamageTypeListComponent } from './damage-type-setup/damage-type-list/damage-type-list.component';
import { DamageTypeEditComponent } from './damage-type-setup/damage-type-edit/damage-type-edit.component';
import { ConditionEditComponent } from './conditions-setup/condition-edit/condition-edit.component';
import { FeaturesSetupComponent } from './features-setup/features-setup.component';
import { FeatureEditComponent } from './features-setup/feature-edit/feature-edit.component';

@NgModule({
  declarations: [
    ConditionsSetupComponent,
    DamageTypeSetupComponent,
    ParticipantsSetupComponent,
    ParticipantsListComponent,
    ParticipantEditComponent,
    DamageTypeListComponent,
    DamageTypeEditComponent,
    ConditionEditComponent,
    FeaturesSetupComponent,
    FeatureEditComponent
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    SharedModule
  ],
  exports: [
    DamageTypeEditComponent,
    ConditionEditComponent,
    FeatureEditComponent
  ]
})
export class SetupModule { }
