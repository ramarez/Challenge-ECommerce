import { Injectable } from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';
import { Message } from '../models/message';
import { IMessageOptions } from '../models/message-options';
import { MessageType } from '../models/message-type.enum';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private subject = new Subject<Message>();
    private defaultId = 'default-message';

    // enable subscribing to messages observable
    onAlert(id = this.defaultId): Observable<Message> {
        return this.subject
            .asObservable()
            .pipe(filter(x => x && x.id === id));
    }

    // convenience methods
    success(message: string, header?: string, options?: IMessageOptions) {
        this.addMessage(new Message({ ...options, type: MessageType.Success, message, header }));
    }

    error(message: string, header?: string, options?: IMessageOptions) {
        this.addMessage(new Message({ ...options, type: MessageType.Error, message, header }));
    }

    info(message: string, header?: string, options?: IMessageOptions) {
        this.addMessage(new Message({ ...options, type: MessageType.Info, message, header }));
    }

    warn(message: string, header?: string, options?: IMessageOptions) {
        this.addMessage(new Message({ ...options, type: MessageType.Warning, message, header }));
    }

    // main alert method    
    addMessage(message: Message) {
        message.id = message.id || this.defaultId;
        this.subject.next(message);
    }

    // clear alerts
    clear(id = this.defaultId) {
        this.subject.next(new Message({ id }));
    }
}
