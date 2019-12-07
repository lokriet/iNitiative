import { Injectable } from '@angular/core';
import { ConditionsStore, ConditionsState } from './conditions.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'conditions' })
export class ConditionsService extends CollectionService<ConditionsState> {

  constructor(store: ConditionsStore) {
    super(store);
  }

}
