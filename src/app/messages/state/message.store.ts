import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { Message } from './message.model';

export interface MessageState extends EntityState<Message>, ActiveState {}


@Injectable({ providedIn: 'root' })
@StoreConfig({name: 'messages'})
export class MessageStore extends EntityStore<MessageState, Message> {
  constructor() {
    super();
  }
}
