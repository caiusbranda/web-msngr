
import { elementDef } from '@angular/core/src/view/element';

import { timeInterval } from 'rxjs/operator/timeInterval';
import { ChatService } from './chat.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Chat } from '../../chat.model';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
    private currentChat: Chat;
    private chatUsers: string;
    private typing = false;
    private timeout = null;
    @ViewChild('chatScroll') private scrollContainer: ElementRef;
    disableScrollDown = false;

  constructor(private route: ActivatedRoute, private chatService: ChatService) { }

  ngOnInit() {
      this.route.params
        .subscribe(
            (params: Params) => {
                this.currentChat = this.chatService.getChat(params['id']);
                this.chatUsers = '';
                const userAmount = this.currentChat.users.length;
                for (let i = 0; i < userAmount; ++i) {
                    this.chatUsers += this.currentChat.users[i].name;
                    if (i !== userAmount - 1) {
                        this.chatUsers += ', ';
                    }
                }
            }
        );

        this.currentChat.messageAdded.subscribe(
            () => {
                this.scrollToBottom();
            }
        );
  }

    onKeyUp() {
        if (!this.typing) {
            this.typing = true;
            this.currentChat.startedTyping();
        }
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.typing = false;
            this.currentChat.stoppedTyping();
        }, 1500);
    }

    getCurrentTyping(): string {
        if (this.currentChat.currentlyTyping !== '') {
            return this.currentChat.currentlyTyping + ' is typing...';
        }
        return '';
    }

    ngAfterViewInit() {
        this.scrollToBottom();
    }


    private onScroll() {
        const element = this.scrollContainer.nativeElement;
        const atBottom = (element.scrollHeight - element.scrollTop - element.clientHeight) < 2;
        console.log(atBottom);
        console.log(element.scrollHeight - element.scrollTop - element.clientHeight);
        if (atBottom) {
            this.disableScrollDown = false;
        } else {
            this.disableScrollDown = true;
        }
    }

    private scrollToBottom(): void {
        /* if (this.disableScrollDown) {
            return;
        } */
        setTimeout(() => {
            try {
                this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
            } catch (err) { console.log(err); }
        }, 200);
    }

}
