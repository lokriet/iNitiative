import { Injectable } from '@angular/core';
import { Condition } from './condition.model';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface ConditionsState extends CollectionState<Condition>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'conditions' })
export class ConditionsStore extends EntityStore<ConditionsState> {

  constructor() {
    super();
  }

}

