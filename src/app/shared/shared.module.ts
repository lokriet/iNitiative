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
import { SortIconComponent } from './sort-icon/sort-icon.component';
import { FilterByNamePipe } from './filter-by-name.pipe';
import { SearchInputComponent } from './search-input/search-input.component';
import { AutosizeModule } from 'ngx-autosize';

@NgModule({
  declarations: [
    ColorsPopupComponent,
    FilterPopupComponent,
    ColorValueComponent,
    PopupComponent,
    PopupWindowDirective,
    SortIconComponent,
    FilterByNamePipe,
    SearchInputComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgSelectModule,
    AutosizeModule
  ],
  exports: [
    ColorsPopupComponent,
    ColorValueComponent,
    FilterPopupComponent,
    PopupWindowDirective,
    SortIconComponent,
    PopupComponent,
    SearchInputComponent,
    FilterByNamePipe,
    FormsModule,
    FontAwesomeModule,
    NgSelectModule,
    AutosizeModule
  ]
})
export class SharedModule { }
