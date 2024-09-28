import { Injectable } from '@angular/core';
import { IMessage } from './message';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor() { }

    add(message: IMessage) {
        switch (message.type) {
            case "Error":
                console.error(message.message);
                break;
            case "Warning":
                console.warn(message.message);
                break;
            case "Success":
                console.log(message.message);
                break;
        }
    }
}