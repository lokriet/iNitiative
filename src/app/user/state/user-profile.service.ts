import { Injectable } from '@angular/core';
import { UserProfileStore, UserProfileState } from './user-profile.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'user-profiles' })
export class UserProfileService extends CollectionService<UserProfileState> {

  constructor(store: UserProfileStore) {
    super(store);
  }

}
