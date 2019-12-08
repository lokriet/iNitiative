import { Injectable } from '@angular/core';
import { EncounterParticipant } from './encounter-participant.model';
import { EntityState, ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface EncounterParticipantState extends CollectionState<EncounterParticipant>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'encounter-participant' })
export class EncounterParticipantStore extends EntityStore<EncounterParticipantState> {

  constructor() {
    super();
  }

}

