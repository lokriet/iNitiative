import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Participant } from 'src/app/setup/state/participants/participant.model';

@Component({
  selector: 'app-add-participants-view',
  templateUrl: './add-participants-view.component.html',
  styleUrls: ['./add-participants-view.component.scss']
})
export class AddParticipantsViewComponent implements OnInit {
  @Output() onParticipantAdded = new EventEmitter<Participant>();

  activeTemlateTab = 'players';

  constructor() { }

  ngOnInit() {
  }


  isTemplateTabActive(tabName: string) {
    return this.activeTemlateTab === tabName;
  }

  setTemplateTabActive(tabName: string) {
    this.activeTemlateTab = tabName;
  }

  addParticipant(participant) {
    this.onParticipantAdded.emit(participant);
  }

}
