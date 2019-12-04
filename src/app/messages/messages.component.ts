import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Order } from '@datorama/akita';
import { faAngry, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

import { Message, MessageType } from './state/message.model';
import { MessageQuery } from './state/message.query';
import { MessageService } from './state/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('1s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MessagesComponent implements OnInit {
  faCheck = faCheck;
  faAngryFace = faAngry;
  faClose = faTimes;

  infoType = MessageType.INFO;
  errorType = MessageType.ERROR;

  messages: Observable<Message[]>;

  constructor(private messageQuery: MessageQuery,
              private messageService: MessageService) { }

  ngOnInit() {
    this.messages = this.messageQuery.selectAll({sortBy: 'id', sortByOrder: Order.DESC});
  }

  onCloseMessage(messageId: number) {
    this.messageService.removeMessage(messageId);
  }

}
