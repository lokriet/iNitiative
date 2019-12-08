import { Injectable } from '@angular/core';
import { EncounterParticipantStore, EncounterParticipantState } from './encounter-participant.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'encounter-participants' })
export class EncounterParticipantService extends CollectionService<EncounterParticipantState> {

  constructor(store: EncounterParticipantStore) {
    super(store);
  }

}
