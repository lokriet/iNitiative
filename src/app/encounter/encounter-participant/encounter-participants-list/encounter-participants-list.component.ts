import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Order } from '@datorama/akita';

import { EncounterParticipant } from '../state/encounter-participant.model';

@Component({
  selector: 'app-encounter-participants-list',
  templateUrl: './encounter-participants-list.component.html',
  styleUrls: ['./encounter-participants-list.component.scss']
})
export class EncounterParticipantsListComponent implements OnInit {
  @Input() participants: EncounterParticipant[] = [];
  @Output() participantDeleted = new EventEmitter<EncounterParticipant>();
  @Output() participantChanged = new EventEmitter<EncounterParticipant>();

  sortByOrder = Order.ASC;
  sortBy = 'name'; // 'name' / 'ini'

  constructor() { }

  ngOnInit() {
    this.sortParticipants();
  }

  onDeleteParticipant(index: number) {
    this.participantDeleted.emit(this.participants[index]);
  }

  onParticipantChanged(newParticipant: EncounterParticipant, i: number) {
    this.participantChanged.emit(newParticipant);
  }

  sortParticipants() {
    if (!this.participants) {
      return;
    }

    this.participants.sort((a, b) => {
      if (this.sortBy === 'name') {
        let result = a.name.localeCompare(b.name);

        if (result === 0) {
          result = (a.initiative + a.initiativeModifier) - (b.initiative + b.initiativeModifier);
        }

        return this.sortByOrder === Order.ASC ? result : -result;
      } else {
        let result = (a.initiative + a.initiativeModifier) - (b.initiative + b.initiativeModifier);

        if (result === 0) {
          result = a.name.localeCompare(b.name);
        }

        return this.sortByOrder === Order.ASC ? result : -result;
      }
    });
  }

  changeSortOrder(sortBy, sortByOrder) {
    if (this.sortBy !== sortBy || this.sortByOrder !== sortByOrder) {
      this.sortBy = sortBy;
      this.sortByOrder = sortByOrder;
      this.sortParticipants();
    }
  }

  switchSortOrder(sortBy) {
    if (this.sortBy === sortBy) {
      this.changeSortOrder(this.sortBy, this.sortByOrder === Order.ASC ? Order.DESC : Order.ASC);
    } else {
      this.changeSortOrder(sortBy, Order.ASC);
    }
  }

  isSortingAsc() {
    return this.sortByOrder === Order.ASC;
  }

}
