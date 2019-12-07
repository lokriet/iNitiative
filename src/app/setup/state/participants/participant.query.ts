import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ParticipantStore, ParticipantState } from './participant.store';

@Injectable({ providedIn: 'root' })
export class ParticipantQuery extends QueryEntity<ParticipantState> {

  constructor(protected store: ParticipantStore) {
    super(store);
  }

}
