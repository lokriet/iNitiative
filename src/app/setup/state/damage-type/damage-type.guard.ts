import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { DamageTypeState } from './damage-type.store';
import { DamageTypeService } from './damage-type.service';


@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class DamageTypeGuard extends CollectionGuard<DamageTypeState> {
  constructor(service: DamageTypeService) {
    super(service);
  }
}
