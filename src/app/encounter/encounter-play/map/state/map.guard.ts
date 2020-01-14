import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';

import { MapService } from './map.service';
import { MapState } from './map.store';


@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class MapGuard extends CollectionGuard<MapState> {
  constructor(service: MapService) {
    super(service);
  }
}
