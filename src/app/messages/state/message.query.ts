import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Message } from './message.model';
import { MessageState, MessageStore } from './message.store';

@Injectable({
  providedIn: 'root'
})
export class MessageQuery extends QueryEntity<MessageState, Message> {
  constructor(protected store: MessageStore) {
    super(store);
  }
}