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
export class ChatComponent implements OnInit, AfterViewInit{
    private currentChat: Chat;
    @ViewChild('chatScroll') private scrollContainer: ElementRef;
    disableScrollDown = false;

  constructor(private route: ActivatedRoute, private chatService: ChatService) { }

  ngOnInit() {
      this.route.params
        .subscribe(
            (params: Params) => {
                this.currentChat = this.chatService.getChat(params['id']);
            }
        );

        this.currentChat.messageAdded.subscribe(
            () => {
                console.log('MESSAGE ADDED');
                this.scrollToBottom();
            }
        );
  }

  ngAfterViewInit() {
      this.scrollToBottom();
  }


    private onScroll() {
        console.log('ONSCROL');
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
        console.log('SCROLLINGL: ' + this.disableScrollDown);
        if (this.disableScrollDown) {
            return;
        }
        setTimeout(() => {
            try {
                this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
            } catch (err) { console.log(err); }
        }, 200);
        console.log('top' + this.scrollContainer.nativeElement.scrollTop);
        console.log('HEIGHT' + this.scrollContainer.nativeElement.scrollHeight);
    }

}
