import { Injectable } from '@angular/core';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

import { UserProfile } from './user-profile.model';

export interface UserProfileState extends CollectionState<UserProfile>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user-profile' })
export class UserProfileStore extends EntityStore<UserProfileState> {

  constructor() {
    super();
  }

}

