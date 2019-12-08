import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorsPopupComponent } from './colors/colors-popup/colors-popup.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FilterPopupComponent } from './filter-popup/filter-popup.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColorValueComponent } from './colors/color-value/color-value.component';
import { PopupComponent } from './popup/popup.component';
import { PopupWindowDirective } from './popup/popup.directive';

@NgModule({
  declarations: [
    ColorsPopupComponent,
    FilterPopupComponent,
    ColorValueComponent,
    PopupComponent,
    PopupWindowDirective
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [
    ColorsPopupComponent,
    ColorValueComponent,
    FilterPopupComponent,
    PopupWindowDirective,
    PopupComponent,
    FormsModule,
    FontAwesomeModule,
    NgSelectModule
  ]
})
export class SharedModule { }
