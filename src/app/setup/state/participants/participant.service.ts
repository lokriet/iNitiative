import { Injectable } from '@angular/core';
import { ParticipantStore, ParticipantState } from './participant.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'participants' })
export class ParticipantService extends CollectionService<ParticipantState> {

  constructor(store: ParticipantStore) {
    super(store);
  }

}
