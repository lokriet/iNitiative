import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Feature } from './feature.model';
import { FeatureState, FeatureStore } from './feature.store';

export const compareFeatures = (f1: Feature, f2: Feature): number => {
  if (f1.type !== f2.type) {
    if (f1.type == null) {
      return -1;
    }

    if (f2.type == null) {
      return 1;
    }

    return f1.type.localeCompare(f2.type);
  }
  return f1.name.localeCompare(f2.name);
};

@Injectable({ providedIn: 'root' })
export class FeatureQuery extends QueryEntity<FeatureState> {

  constructor(protected store: FeatureStore) {
    super(store);
  }

}
