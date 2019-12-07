import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DamageTypeStore, DamageTypeState } from './damage-type.store';

@Injectable({ providedIn: 'root' })
export class DamageTypeQuery extends QueryEntity<DamageTypeState> {

  constructor(protected store: DamageTypeStore) {
    super(store);
  }

}
