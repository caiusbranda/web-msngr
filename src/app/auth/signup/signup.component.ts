import { Error } from '../../errors/error.model';
import { ErrorService } from '../../errors/errors.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    myForm: FormGroup;

    constructor(private errorService: ErrorService,
        private authService: AuthService, private route: ActivatedRoute,
        private router: Router) {}

    onSubmit() {
        const user = new User(
            this.myForm.value.email,
            this.myForm.value.password,
            this.myForm.value.name,
            [],
            '',
            []
        );
        this.authService.signup(user)
            .subscribe(
                (data) => {
                    this.errorService.handleError(
                        {
                            title: 'Registration Successful',
                            error: {
                            message: ('Thank you for registering, ' + data.obj.name + '!')
                            }
                    });

                    this.authService.signin(user)
                    .subscribe(
                        data => {
                            localStorage.setItem('token', data.token);
                            localStorage.setItem('userId', data.userId);
                            localStorage.setItem('name', data.name);
                            localStorage.setItem('email', data.email);
                            this.router.navigateByUrl('/chats');
                        },
                    );
                }
            );

        this.myForm.reset();

    }

    ngOnInit() {
        this.myForm = new FormGroup({
            name: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                // tslint:disable-next-line:max-line-length
                Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')
            ]),
            password: new FormControl(null, Validators.required)
        });
    }
}
