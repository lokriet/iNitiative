import { Injectable } from '@angular/core';
import { EncounterStore, EncounterState } from './encounter.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'encounters' })
export class EncounterService extends CollectionService<EncounterState> {

  constructor(store: EncounterStore) {
    super(store);
  }

}
