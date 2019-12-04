import { Injectable } from '@angular/core';

import { MessageType } from './message.model';
import { MessageStore } from './message.store';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private messageStore: MessageStore) {}

  nextMessageId = 0;

  addError(errorMessage: string) {
    this.addMessage(MessageType.ERROR, errorMessage);
  }

  addInfo(infoMessage: string) {
    this.addMessage(MessageType.INFO, infoMessage);
  }

  addMessage(messageType: MessageType, message: string) {
    const messageId = this.nextMessageId;
    this.nextMessageId++;

    this.messageStore.add({id: messageId, type: messageType, message});

    setTimeout(() => {
      this.removeMessage(messageId);
    }, 15 * 1000);
  }

  removeMessage(messageId: number) {
    this.messageStore.remove(messageId);
  }
}
