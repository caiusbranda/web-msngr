import { Message } from './message/message.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
    @Input() messages: Message[] = [];
    currentUser = localStorage.getItem('email');

    constructor() { }

    ngOnInit() {
    }
}
