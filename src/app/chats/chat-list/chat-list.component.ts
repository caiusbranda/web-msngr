import { ChatService } from './chat/chat.service';
import { Chat } from '../chat.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
    chats: Chat[] = [];

    constructor(private chatService: ChatService) { }

    ngOnInit() {
        this.chatService.getChats().
            subscribe(
                (allChats: Chat[]) => {
                    this.chats = allChats;
                }
            );
    }
}
