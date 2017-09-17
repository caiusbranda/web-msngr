import { ActivatedRoute } from '@angular/router';
import { Chat } from './chat.model';
import { ChatService } from './chat-list/chat/chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
    chats: Chat[] = [];

        constructor(private chatService: ChatService, private route: ActivatedRoute) {
            route.data.pluck('chat').map(
                (value: Chat[]) => {
                    this.chats = value;
                }
            );
        }

        ngOnInit() {
            this.chatService.getChats().
                subscribe(
                    (allChats: Chat[]) => {
                        this.chats = allChats;
                    }
                );
        }
}
