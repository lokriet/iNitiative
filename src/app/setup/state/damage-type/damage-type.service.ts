import { Injectable } from '@angular/core';
import { DamageTypeStore, DamageTypeState } from './damage-type.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'damage-types' })
export class DamageTypeService extends CollectionService<DamageTypeState> {

  constructor(store: DamageTypeStore) {
    super(store);
  }

}
