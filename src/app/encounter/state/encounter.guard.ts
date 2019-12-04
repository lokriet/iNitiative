import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';

import { EncounterState } from './encounter.store';
import { EncounterService } from './encounter.service';

@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class EncounterGuard extends CollectionGuard<EncounterState> {
  constructor(service: EncounterService) {
    super(service);
  }
}
