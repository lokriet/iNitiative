import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { EncounterStore, EncounterState } from './encounter.store';

@Injectable({ providedIn: 'root' })
export class EncounterQuery extends QueryEntity<EncounterState> {

  constructor(protected store: EncounterStore) {
    super(store);
  }

}
