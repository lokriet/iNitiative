import { Injectable } from '@angular/core';
import { Participant } from './participant.model';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface ParticipantState extends CollectionState<Participant>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'participant' })
export class ParticipantStore extends EntityStore<ParticipantState> {

  constructor() {
    super();
  }

}

