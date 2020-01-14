import { Injectable } from '@angular/core';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

import { Map } from './map.model';

export interface MapState extends CollectionState<Map>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'map' })
export class MapStore extends EntityStore<MapState> {

  constructor() {
    super();
  }

}

