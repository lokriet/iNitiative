import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MapStore, MapState } from './map.store';

@Injectable({ providedIn: 'root' })
export class MapQuery extends QueryEntity<MapState> {

  constructor(protected store: MapStore) {
    super(store);
  }

}
