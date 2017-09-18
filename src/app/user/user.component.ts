import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { User } from '../auth/user.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    myForm: FormGroup;
    formBuilder = new FormBuilder();
    currentUser: User;
    emails: FormArray;

    constructor(private userService: UserService, private route: ActivatedRoute,
        private router: Router) {
/*         route.data.pluck('user').map(
            (value: User) => {
                this.currentUser = value;
            }
        ); */
     }

    onSubmit() {
        const newFriends = [];
        this.emails.controls.forEach(element => {
            newFriends.push(element.value);
        });
        this.userService.addFriends(newFriends).subscribe();
    }

    createItem(): FormGroup {
        return this.formBuilder.group({
            email: ['', [Validators.required,
                // tslint:disable-next-line:max-line-length
                Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')
]]
        },
        {
            validator: Validators.required
        });
    }

    addInputs() {
        this.emails = this.myForm.get('emails') as FormArray;
        this.emails.push(this.createItem());
    }

    removeInputs() {
        this.emails.controls.pop();
    }

    ngOnInit() {
        this.currentUser = this.userService.getServiceUser();

        this.myForm = this.formBuilder.group({
            emails: this.formBuilder.array([this.createItem()])
        });
        this.emails = this.myForm.get('emails') as FormArray;
    }

}
