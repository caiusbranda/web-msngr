import { ChatService } from './chat-list/chat/chat.service';
import { Observable } from 'rxjs/Rx';
import { Message } from './message-list/message/message.model';
import { User } from '../auth/user.model';
import * as io from 'socket.io-client';

export class Chat {
    socket: any;

    constructor(
        public users: User[],
        public messages: Message[],
        public chatId?: string) {

            this.socket = io();
            this.socket.emit('join', this.chatId);
            this.listen('new message').subscribe(msg => {
                this.messages.push(msg);
            });

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
