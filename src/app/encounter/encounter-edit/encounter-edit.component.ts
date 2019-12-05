import { Component, OnInit, OnDestroy } from '@angular/core';

import { EncounterService } from '../state/encounter.service';
import { AuthService } from 'src/app/auth/state/auth.service';
import { guid } from '@datorama/akita';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/messages/state/message.service';
import { EncounterQuery } from '../state/encounter.query';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-encounter-edit',
  templateUrl: './encounter-edit.component.html',
  styleUrls: ['./encounter-edit.component.scss']
})
export class EncounterEditComponent implements OnInit, OnDestroy {
  encounterName: string;
  sub: Subscription;
  errorMessage: string = null;

  constructor(private encounterService: EncounterService,
              private encounterQuery: EncounterQuery,
              private authService: AuthService,
              private messageService: MessageService,
              private router: Router) { }

  ngOnInit() {
    this.sub = this.encounterService.syncCollection().subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmitForm() {
    const existingName = this.encounterQuery.getAll({filterBy: encounter => encounter.name === this.encounterName});
    if (existingName != null && existingName.length > 0) {
      this.errorMessage = 'Encounter with this name already exists. Choose another one';
      return;
    }

    const currentDate = new Date();
    this.encounterService.add({
      id: guid(),
      owner: this.authService.user.uid,
      name: this.encounterName,
      createdDate: currentDate.getTime(),
      lastModifiedDate: currentDate.getTime()
    }).then(value => {
      this.messageService.addInfo(`Yay, encounter ${this.encounterName} created!`);
      this.router.navigate(['encounters']);
    });
  }
}
