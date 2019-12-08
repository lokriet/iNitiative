import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { EncounterParticipantState } from './encounter-participant.store';
import { EncounterParticipantService } from './encounter-participant.service';


@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class EncounterParticipantGuard extends CollectionGuard<EncounterParticipantState> {
  constructor(service: EncounterParticipantService) {
    super(service);
  }
}
