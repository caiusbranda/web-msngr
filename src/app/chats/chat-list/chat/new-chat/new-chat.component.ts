import { Router } from '@angular/router';
import { User } from '../../../../auth/user.model';
import { Chat } from '../../../chat.model';
import { ChatService } from '../chat.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.css']
})
export class NewChatComponent implements OnInit {
    myForm: FormGroup;

    constructor(private chatService: ChatService, private router: Router) {}

    onSubmit() {
        const userEmails = this.myForm.value.users.split(',');
        const users: User[] = [];

        userEmails.map(function(userEmail){
            userEmail.trim();
            users.push(new User(userEmail, ''));
        });

        const chat = new Chat(
            users,
            []
        );
        this.chatService.addChat(chat)
            .subscribe(
                data => {
                    this.router.navigateByUrl('/chats/' + data.chatId);
                },
                error => console.error(error)
            );
        this.myForm.reset();
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            users: new FormControl(null, Validators.required)
        });
    }
}
