import { Injectable } from '@angular/core';
import { MapStore, MapState } from './map.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'maps' })
export class MapService extends CollectionService<MapState> {

  constructor(store: MapStore) {
    super(store);
  }

}
