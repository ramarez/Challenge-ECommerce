import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../models/message';
import { Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { MessageType } from '../../models/message-type.enum';

@Component({
    selector: 'app-message',
    standalone: true,
    imports: [],
    templateUrl: './message.component.html',
    styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit, OnDestroy {
    @Input() id = 'default-message';
    @Input() fade = true;

    messages: Message[] = [];
    messageSubscription!: Subscription;
    routeSubscription!: Subscription;

    constructor(private router: Router, private messageService: MessageService) { }
    
    ngOnInit(): void {
        // subscribe to new message notifications
        this.messageSubscription = this.messageService.onAlert(this.id)
            .subscribe(message => {
                // clear messages when an empty message is received
                if (!message.message) {
                    // filter out alerts without 'keepAfterRouteChange' flag
                    this.messages = this.messages.filter(x => x.keepAfterRouteChange);

                    // remove 'keepAfterRouteChange' flag on the rest
                    this.messages.forEach(x => delete x.keepAfterRouteChange);
                    return;
                }

                // add message to array
                this.messages.push(message);

                // auto close message if required
                if (message.autoClose) {
                    setTimeout(() => this.removeMessage(message), 3000);
                }
            });

        // clear messages on location change
        this.routeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.messageService.clear(this.id);
            }
        });
    }

    ngOnDestroy(): void {
        // unsubscribe to avoid memory leaks
        this.messageSubscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    }

    removeMessage(message: Message) {
        // check if already removed to prevent error on auto close
        if (!this.messages.includes(message)) return;

        // fade out message if this.fade === true
        const timeout = this.fade ? 250 : 0;
        message.fade = this.fade;

        setTimeout(() => {
            // filter message out of array
            this.messages = this.messages.filter(x => x !== message);
        }, timeout);
    }

    ccsClass(message: Message, option: number) {
        switch(message.type) {
            case MessageType.Success:
                {
                    switch(option) {
                        case 1:
                            return 'flex items-center bg-green-100';
                        case 2:
                            return 'w-full bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg';
                        case 3:
                            return 'ms-auto -my-1.5 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8';
                    }
                }
                break;
            case MessageType.Error:
                {
                    switch(option) {
                        case 1:
                            return 'flex items-center bg-red-100';
                        case 2:
                            return 'w-full bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg';
                        case 3:
                            return 'ms-auto -my-1.5 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8';
                    }
                }
                break;
            case MessageType.Info:
                {
                    switch(option) {
                        case 1:
                            return 'flex items-center bg-blue-100';
                        case 2:
                            return 'w-full bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg';
                        case 3:
                            return 'ms-auto -my-1.5 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8';
                    }
                }
                break;
            case MessageType.Warning:
                {
                    switch(option) {
                        case 1:
                            return 'flex items-center bg-yellow-100';
                        case 2:
                            return 'w-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg';
                        case 3:
                            return 'ms-auto -my-1.5 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex items-center justify-center h-8 w-8';
                    }
                }
                break;
        }

        return '';
    }
}
