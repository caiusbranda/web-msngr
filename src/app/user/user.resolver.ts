import { UserService } from './user.service';
import { User } from '../auth/user.model';
import { observable } from 'rxjs/symbol/observable';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { Resolve } from '@angular/router';

@Injectable()
export class UserResolver implements Resolve<User> {

    constructor(private userService: UserService) {
    }

    resolve(): Observable<User> {
        return this.userService.getCurrentUser();
    }
}
