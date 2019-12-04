import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@NgModule({
  declarations: [ViewProfileComponent, EditProfileComponent],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
