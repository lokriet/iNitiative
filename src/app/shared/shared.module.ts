import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutosizeModule } from 'ngx-autosize';

import { AvatarUploaderComponent } from './avatar-uploader/avatar-uploader.component';
import { ColorValueComponent } from './colors/color-value/color-value.component';
import { ColorsPopupComponent } from './colors/colors-popup/colors-popup.component';
import { FilterByNamePipe } from './filter-by-name.pipe';
import { FilterPopupComponent } from './filter-popup/filter-popup.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PopupComponent } from './popup/popup.component';
import { PopupWindowDirective } from './popup/popup.directive';
import { SearchInputComponent } from './search-input/search-input.component';
import { SortIconComponent } from './sort-icon/sort-icon.component';

@NgModule({
  declarations: [
    ColorsPopupComponent,
    FilterPopupComponent,
    ColorValueComponent,
    PopupComponent,
    PopupWindowDirective,
    SortIconComponent,
    FilterByNamePipe,
    SearchInputComponent,
    AvatarUploaderComponent,
    LoadingSpinnerComponent
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
    AutosizeModule,
    AvatarUploaderComponent,
    LoadingSpinnerComponent
  ]
})
export class SharedModule { }
