import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { faDiceD6 } from '@fortawesome/free-solid-svg-icons';

import { EncounterParticipant } from '../state/encounter-participant.model';
import { EncounterParticipantQuery } from '../state/encounter-participant.query';


export const ENCOUNTER_PARTICIPANTS_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => SetupAddedParticipantsViewComponent),
  multi: true,
};


@Component({
  selector: 'app-setup-added-participants-view',
  templateUrl: './setup-added-participants-view.component.html',
  styleUrls: ['./setup-added-participants-view.component.scss'],
  providers: [ENCOUNTER_PARTICIPANTS_VALUE_ACCESSOR]
})
export class SetupAddedParticipantsViewComponent implements ControlValueAccessor {
  rollIcon = faDiceD6;

  addedParticipants: EncounterParticipant[] = [];

  onChange: any = () => { };

  constructor() { }

  generateInitiatives() {
    for (const participant of this.addedParticipants) {
      this.generateInitiative(participant);
    }
  }

  generateInitiative(participant: EncounterParticipant) {
    if (participant.initiative === null) {
      participant.initiative = Math.ceil(Math.random() * 20);
    }
  }

  deleteParticipant(participant: EncounterParticipant) {
    this.addedParticipants = this.addedParticipants.filter(value => value.id !== participant.id);
    this.onChange(this.addedParticipants);
  }

  changeParticipant(participant: EncounterParticipant) {
    const participantIndex = this.addedParticipants.findIndex(item => item.id === participant.id);
    this.addedParticipants.splice(participantIndex, 1, participant);
    this.onChange(this.addedParticipants);
  }

  writeValue(participants: EncounterParticipant[]): void {
    this.addedParticipants = participants;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // do nothing
  }
}
