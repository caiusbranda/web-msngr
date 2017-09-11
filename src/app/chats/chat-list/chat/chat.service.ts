import { Message } from '../../message-list/message/message.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Chat } from '../../chat.model';
import { Headers, Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';


@Injectable()
export class ChatService {
    private chats: Chat[] = [];
    constructor(private http: Http, private router: Router) {}

    getChats() {
        return this.http.get('http://localhost:3000/chats')
            .map((response: Response) => {
                const newChats = response.json().obj;
                const transformedChats: Chat[] = [];
                for (const chat of newChats) {
                    transformedChats.push(new Chat(chat.users, chat.messages, chat._id));
                }
                this.chats = transformedChats;
                return transformedChats;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getChat(id: string) {
        for (const chat of this.chats) {
            if (chat.chatId === id) {
                return chat;
            }
        }
        this.router.navigateByUrl('/', {skipLocationChange: true});
    }

    addChat(chat: Chat) {
        const body = JSON.stringify(chat);
        const headers = new Headers({
            'Content-Type': 'application/json'
        });
        return this.http.post('http://localhost:3000/chats', body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                const newChat = new Chat(result.obj.users, [], result.obj._id);
                this.chats.push(newChat);
                return newChat;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    deleteChat(chat: Chat) {
        this.chats.splice(this.chats.indexOf(chat), 1);
        return this.http.delete('http://localhost:3000/message/' + chat.chatId)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    addMessage(chat: Chat, message: Message) {
        // push message locally
        chat.messages.push(message);

        const updateComponents = {
            targetChat: chat.chatId,
            newMessage: message
        };

        const body = JSON.stringify(updateComponents);
        const headers = new Headers({
            'Content-Type': 'application/json'
        });
        return this.http.post('http://localhost:3000/chats', body, {headers: headers})
            .subscribe();
           /*  .map((response: Response) => {
                const result = response.json();
                const newChat = new Chat(result.obj.users, [], result.obj._id);
                this.chats.push(newChat);
                return newChat;
            })
            .catch((error: Response) => Observable.throw(error.json())); */
    }
}

