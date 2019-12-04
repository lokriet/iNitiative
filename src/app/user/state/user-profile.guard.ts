import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';

import { UserProfileService } from './user-profile.service';
import { UserProfileState } from './user-profile.store';

@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class UserProfileGuard extends CollectionGuard<UserProfileState> {
  constructor(service: UserProfileService) {
    super(service);
  }
}
