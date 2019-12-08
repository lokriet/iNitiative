import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { EncounterParticipantStore, EncounterParticipantState } from './encounter-participant.store';

@Injectable({ providedIn: 'root' })
export class EncounterParticipantQuery extends QueryEntity<EncounterParticipantState> {

  constructor(protected store: EncounterParticipantStore) {
    super(store);
  }

}
