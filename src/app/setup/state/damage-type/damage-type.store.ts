import { Injectable } from '@angular/core';
import { DamageType } from './damage-type.model';
import { EntityState, ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface DamageTypeState extends CollectionState<DamageType>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'damage-type' })
export class DamageTypeStore extends EntityStore<DamageTypeState> {

  constructor() {
    super();
  }

}

