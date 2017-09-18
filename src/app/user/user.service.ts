import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers } from '@angular/http';
import { User } from '../auth/user.model';
import { Injectable } from '@angular/core';


@Injectable()
export class UserService {

    currentUser: User;

    constructor(private http: Http) {
        this.getCurrentUser().subscribe();
    }

    getServiceUser() {
        return this.currentUser;
    }

    getCurrentUser() {
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';

        return this.http.get('/api/user' + token)
        .map((response: Response) => {
            const newUser = response.json().user;
            this.currentUser = newUser;
            return newUser;
        })
        .catch((error: Response) => Observable.throw(error));
    }

    addFriends(users) {
        const body = JSON.stringify({users});

        const headers = new Headers({
            'Content-Type': 'application/json'
        });

            // if token exists, set it equal to const token, else make const token empty
            const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token') : '';

        return this.http.post('/api/user/friends' + token, body, {headers: headers})
            .catch((error: Response) => Observable.throw(error.json()));
    }


}
