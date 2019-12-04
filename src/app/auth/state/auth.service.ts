import { Injectable } from '@angular/core';
import { CollectionConfig, FireAuthService } from 'akita-ng-fire';
import { AuthState, AuthStore } from './auth.store';
import { User } from 'firebase';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'users' })
export class AuthService extends FireAuthService<AuthState> {
  constructor(store: AuthStore) {
    super(store);
  }

  createProfile(user: User): AuthState['profile'] {
    return { uid: user.uid, email: user.email };
  }
}
