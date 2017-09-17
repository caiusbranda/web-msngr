import { ChatService } from './chat/chat.service';
import { Chat } from '../chat.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
   @Input() chats: Chat[] = [];

    constructor() { }

    ngOnInit() {}
}
