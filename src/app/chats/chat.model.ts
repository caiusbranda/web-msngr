import { ChatService } from './chat-list/chat/chat.service';
import { Observable, Subject } from 'rxjs/Rx';
import { Message } from './message-list/message/message.model';
import { User } from '../auth/user.model';
import * as io from 'socket.io-client';

export class Chat {
    socket: any;
    messageAdded = new Subject();
    currentlyTyping = '';

    constructor(
        public users: User[],
        public messages: Message[],
        public name: string,
        public chatId?: string,
        ) {

            this.socket = io();
            this.socket.emit('join', this.chatId);
            this.listen('new message').subscribe(msg => {
                this.messages.push(msg);
                this.messageAdded.next();
            });
            // listen to who is typing
            this.listen('typing').subscribe(
                (user) => {
                    this.currentlyTyping = user;
                }
            );

        }

    startedTyping() {
        this.socket.emit('typing', this.chatId, localStorage.getItem('name'));
    }

    stoppedTyping() {
        this.socket.emit('typing', this.chatId, '');
    }

    addMessage(msg: Message) {
        this.socket.emit('new message', this.chatId, msg);
    }

    listen(event: string): Observable<any> {

        return new Observable(observer => {

            this.socket.on(event, data => {
            observer.next(data);
            });

            // observable is disposed
            return () => {
            this.socket.off(event);
            };
        });
    }
}
