import { Injectable } from '@angular/core';
import { Encounter } from './encounter.model';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface EncounterState extends CollectionState<Encounter>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'encounter' })
export class EncounterStore extends EntityStore<EncounterState> {

  constructor() {
    super();
  }

}

