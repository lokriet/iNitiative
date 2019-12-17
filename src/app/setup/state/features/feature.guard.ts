import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { FeatureService } from './feature.service';
import { FeatureState } from './feature.store';


@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class FeatureGuard extends CollectionGuard<FeatureState> {
  constructor(service: FeatureService) {
    super(service);
  }
}
