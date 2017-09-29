import { User } from '../../../../auth/user.model';
import { Message } from '../message.model';
import { ChatService } from '../../../chat-list/chat/chat.service';
import { Chat } from '../../../chat.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent implements OnInit {
    myForm: FormGroup;
    @Input() chat: Chat;
    @ViewChild('msgInput') msgInput: ElementRef;

        constructor(private chatService: ChatService) {}

        onSubmit() {
            this.chatService.addMessage(this.chat, this.myForm.value.message);
            this.myForm.reset();
            this.msgInput.nativeElement.focus();
        }

        ngOnInit() {
            this.myForm = new FormGroup({
                message: new FormControl(null, Validators.required)
            });
        }
}
