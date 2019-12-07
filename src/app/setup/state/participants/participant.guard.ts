import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { ParticipantState } from './participant.store';
import { ParticipantService } from './participant.service';


@Injectable({ providedIn: 'root' })
@CollectionGuardConfig({ awaitSync: true })
export class ParticipantGuard extends CollectionGuard<ParticipantState> {
  constructor(service: ParticipantService) {
    super(service);
  }
}
