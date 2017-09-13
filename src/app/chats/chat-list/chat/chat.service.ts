import { Message } from '../../message-list/message/message.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Chat } from '../../chat.model';
import { Headers, Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ChatService {
    private chats: Chat[] = [];
    constructor(private router: Router, private http: Http) {}

    getChats() {

        // if token exists, set it equal to const token, else make const token empty
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';


        return this.http.get('http://localhost:3000/chats' + token)
            .map((response: Response) => {
                const newChats = response.json().chats;
                const transformedChats: Chat[] = [];

                for (const chat of newChats) {
                    const newChat = new Chat(chat.users, chat.messages, chat._id);
                    transformedChats.push(newChat);
                    console.log(newChat);
                }
                this.chats = transformedChats;
                return transformedChats;
            })
            .catch((error: Response) => Observable.throw(error));
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
        console.log(body);
         // if token exists, set it equal to const token, else make const token empty
         const token = localStorage.getItem('token')
         ? '?token=' + localStorage.getItem('token') : '';
        return this.http.post('http://localhost:3000/chats' + token, body, {headers: headers})
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
         // if token exists, set it equal to const token, else make const token empty
         const token = localStorage.getItem('token')
         ? '?token=' + localStorage.getItem('token') : '';

        return this.http.delete('http://localhost:3000/message/' + chat.chatId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    addMessage(chat: Chat, message: string) {
        // push message locally
        const newMessageText = {
            contentText: message
        };

        const body = JSON.stringify(newMessageText);
        const headers = new Headers({
            'Content-Type': 'application/json'
        });

         // if token exists, set it equal to const token, else make const token empty
         const token = localStorage.getItem('token')
         ? '?token=' + localStorage.getItem('token') : '';

        return this.http.post('http://localhost:3000/chats' + '/' + chat.chatId + '/content' + token, body, {headers: headers})
            .map(
                (response: Response) => chat.messages.push(response.json().obj)
            )
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

