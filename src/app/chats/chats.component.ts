import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { Chat } from './chat.model';
import { ChatService } from './chat-list/chat/chat.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit, OnDestroy {
    chats: Chat[] = [];
    subscriptions: Subscription[] = [];

        constructor(private chatService: ChatService, private route: ActivatedRoute) {
            /* route.data.pluck('chat').map(
                (value: Chat[]) => {
                    this.chats = value;
                }
            ); */
        }

        ngOnInit() {
            this.chats = this.chatService.getServiceChats();
            this.chats.forEach((chat, index) => {
               this.subscriptions[index] = chat.messageAdded.subscribe(
                    (data: string) => {
                        this.chats = this.chatService.getServiceChats();
                    }
                );
            });
        }

        ngOnDestroy() {
            this.subscriptions.forEach((sub) => {
                sub.unsubscribe();
            });
        }
}
