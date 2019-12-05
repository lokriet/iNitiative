import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorsPopupComponent } from './colors-popup/colors-popup.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FilterPopupComponent } from './filter-popup/filter-popup.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ColorsPopupComponent,
    FilterPopupComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule
  ],
  exports: [
    ColorsPopupComponent,
    FilterPopupComponent
  ]
})
export class SharedModule { }
