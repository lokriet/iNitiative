import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UserProfileStore, UserProfileState } from './user-profile.store';

@Injectable({ providedIn: 'root' })
export class UserProfileQuery extends QueryEntity<UserProfileState> {

  constructor(protected store: UserProfileStore) {
    super(store);
  }

}
