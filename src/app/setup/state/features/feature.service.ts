import { Injectable } from '@angular/core';
import { FeatureStore, FeatureState } from './feature.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'features' })
export class FeatureService extends CollectionService<FeatureState> {

  constructor(store: FeatureStore) {
    super(store);
  }

}
