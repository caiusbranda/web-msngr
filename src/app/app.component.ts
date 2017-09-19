import { Subscription } from 'rxjs/Rx';
import { AuthService } from './auth/auth.service';
import { Http, Response } from '@angular/http';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.subscription = this.authService.isAuthenticated().subscribe(
            (auth) => {
                if (auth === 'false' || auth === false) {
                    localStorage.clear();
                }
            }
        );
    }

    ngOnDestroy() {
        localStorage.clear();
        this.subscription.unsubscribe();
    }
}
