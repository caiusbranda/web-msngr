import { UserService } from '../../../../user/user.service';
import { Router } from '@angular/router';
import { User } from '../../../../auth/user.model';
import { Chat } from '../../../chat.model';
import { ChatService } from '../chat.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.css']
})
export class NewChatComponent implements OnInit {
    myForm: FormGroup;
    currentUser: User;
    isClicked = [];

    @ViewChildren('friends') private selectedFriends: QueryList<ElementRef>;
    // @ViewChildren('friends') private selectedFriends: QueryList<'friends'>;


    constructor(private chatService: ChatService, private userService: UserService, private router: Router) {}

    submitChat() {
        const friends = [];

        this.selectedFriends.forEach((val) => {
             if (val.nativeElement.classList.contains('custom-activated')) {
                friends.push({email: val.nativeElement.name});
            }
        });

        const newChat = new Chat(
            friends,
            [],
            this.myForm.value.name
        );

        this.chatService.addChat(newChat)
        .subscribe(
            data => {
                this.router.navigateByUrl('/chats/' + data.chatId, {skipLocationChange: true});
            },
            error => console.error(error)
        );

        this.myForm.reset();
    }

    onSubmit() {
        this.submitChat();
        /* const userEmails = this.myForm.value.users.split(',');
        const users: User[] = [];

        userEmails.map(function(userEmail){
            userEmail.trim();
            users.push(new User(userEmail, '', '', [], '', []));
        });

        const chat = new Chat(
            users,
            [],
            this.myForm.value.name
        );
        this.chatService.addChat(chat)
            .subscribe(
                data => {
                    this.router.navigateByUrl('/chats/' + data.chatId);
                },
                error => console.error(error)
            );
        this.myForm.reset(); */
    }

    ngOnInit() {
        this.currentUser = this.userService.getServiceUser();

        this.currentUser.friends.forEach((friend) => {
            this.isClicked.push(-1);
        });

        this.myForm = new FormGroup({
            name: new FormControl(null, Validators.required)
        });
    }
}
