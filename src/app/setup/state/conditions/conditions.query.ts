import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ConditionsStore, ConditionsState } from './conditions.store';

@Injectable({ providedIn: 'root' })
export class ConditionsQuery extends QueryEntity<ConditionsState> {

  constructor(protected store: ConditionsStore) {
    super(store);
  }

}
