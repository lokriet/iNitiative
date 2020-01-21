import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ParticipantType } from '../state/participants/participant.model';

@Component({
  selector: 'app-participants-setup',
  templateUrl: './participants-setup.component.html',
  styleUrls: ['./participants-setup.component.scss']
})
export class ParticipantsSetupComponent implements OnInit, OnDestroy {
  participantType: ParticipantType;
  sub;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.participantType = +params.tab || ParticipantType.Player;
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
