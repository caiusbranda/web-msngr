import { User } from '../../auth/user.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {
    @Input() users: User[];

    constructor() { }

    ngOnInit() {
    }

}
