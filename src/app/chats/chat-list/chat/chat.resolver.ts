import { observable } from 'rxjs/symbol/observable';
import { ChatService } from './chat.service';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { Chat } from '../../chat.model';
import { Resolve } from '@angular/router';

@Injectable()
export class ChatResolver implements Resolve<Chat[]> {
    private routeParam: string;

    constructor(private chatService: ChatService) {
    }

    resolve(): Observable<Chat[]> {
        return this.chatService.getChats();
    }
}
