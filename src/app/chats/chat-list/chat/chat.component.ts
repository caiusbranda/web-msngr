import { ChatService } from './chat.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Chat } from '../../chat.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
    private currentChat: Chat;

  constructor(private route: ActivatedRoute, private chatService: ChatService) { }

  ngOnInit() {
      this.route.params
        .subscribe(
            (params: Params) => {
                this.currentChat = this.chatService.getChat(params['id']);
            }
        );
  }

}
