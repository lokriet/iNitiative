import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { ConditionsService } from './conditions.service';
import { ConditionsState } from './conditions.store';


@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class ConditionGuard extends CollectionGuard<ConditionsState> {
  constructor(service: ConditionsService) {
    super(service);
  }
}
