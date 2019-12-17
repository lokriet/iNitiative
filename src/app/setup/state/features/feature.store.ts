import { Injectable } from '@angular/core';
import { Feature } from './feature.model';
import { EntityState, ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface FeatureState extends CollectionState<Feature>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'feature' })
export class FeatureStore extends EntityStore<FeatureState> {

  constructor() {
    super();
  }

}

