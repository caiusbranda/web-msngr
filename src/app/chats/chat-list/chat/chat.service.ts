import { DatePipe } from '@angular/common/src/pipes/date_pipe';
import { User } from '../../../auth/user.model';
import { Message } from '../../message-list/message/message.model';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs/Rx';
import { Chat } from '../../chat.model';
import { Headers, Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
    private chats: Chat[] = [];
    private socket: any;
    messageAdded = new Subject();

    constructor(private router: Router, private http: Http) {
        this.socket = io();

        // listen for chats associated with the currently logged in ID
        // in order to see new chats realtime-popup
        this.socket.emit('join', localStorage.getItem('userId'));
        this.listen('new chat').subscribe(
            chatData => {
                const newChat = new Chat(chatData.users, [], chatData.name, chatData.chatId);
                this.chats.push(newChat);
            }
        );
    }


    getChats() {

        // if token exists, set it equal to const token, else make const token empty
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';


        return this.http.get('/api/chats' + token)
            .map((response: Response) => {
                const newChats = response.json().chats;
                const transformedChats: Chat[] = [];

                // console.log(this.socket);

                // this.socket.emit('get chats', newChats);

                for (const chat of newChats) {
                    const newChat = new Chat(chat.users, chat.messages, chat.name, chat._id);
                    transformedChats.push(newChat);
                }
                this.chats = transformedChats;
                return this.chats;
            })
            .catch((error: Response) => Observable.throw(error));
    }

    getChat(id: string) {
        for (const chat of this.chats) {
            if (chat.chatId === id) {
                return chat;
            }
        }
        console.log('chat not found:' + id);
        this.router.navigateByUrl('/', {skipLocationChange: true});
    }

    addChat(chat: Chat) {
        // need to set the socket to null to avoid cyclical references
        // otherwise JSON.stringify will fail
        chat.socket = null;
        const body = JSON.stringify(chat);

        const headers = new Headers({
            'Content-Type': 'application/json'
        });

         // if token exists, set it equal to const token, else make const token empty
         const token = localStorage.getItem('token')
         ? '?token=' + localStorage.getItem('token') : '';

        return this.http.post('/api/chats' + token, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                const newChat = new Chat(result.obj.users, [], result.obj.name, result.obj._id);
                this.chats.push(newChat);

                result.obj.users.forEach(user => {
                    this.socket.emit(
                        'new chat',
                        {users: result.obj.users, name: result.obj.name, chatId: result.obj._id},
                        user._id
                    );
                });


                return newChat;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    deleteChat(chat: Chat) {
        this.chats.splice(this.chats.indexOf(chat), 1);
         // if token exists, set it equal to const token, else make const token empty
         const token = localStorage.getItem('token')
         ? '?token=' + localStorage.getItem('token') : '';

        return this.http.delete('/api/message/' + chat.chatId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    addMessage(chat: Chat, message: string) {

        const tempMessage = new Message(
            message,
            new User(
                localStorage.getItem('email'),
                '',
                localStorage.getItem('name'),
                [],
                localStorage.getItem('userId')
            ),
            Date.now()
        );

        const body = JSON.stringify(tempMessage);
        const headers = new Headers({
            'Content-Type': 'application/json'
        });

         // if token exists, set it equal to const token, else make const token empty
         const token = localStorage.getItem('token')
         ? '?token=' + localStorage.getItem('token') : '';


        chat.messages.push(tempMessage);
        chat.messageAdded.next();
        chat.addMessage(tempMessage);

        return this.http.post('/api/chats' + '/' + chat.chatId + '/content' + token, body, {headers: headers})
            .map(
                (response: Response) => {
                    // the model based on the mongoose schema
                    // needs to be converted into Angular form of user

                    /* const messageSchema = response.json().obj;
                    const newMessage = new Message(
                        messageSchema.contentText,
                        new User(messageSchema.author.email,
                            '',
                            [], // currently message does not know about author's other chats
                            messageSchema.author.firstName,
                            messageSchema.author.lastName,
                            ));
                    chat.messages.push(newMessage); */

                }
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

