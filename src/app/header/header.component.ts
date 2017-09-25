import { AuthService } from '../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    showDropdown = false;

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }

    disableDropdown() {
        this.showDropdown = false;
    }

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  isLoggedIn() {
      return this.authService.isLoggedIn();
  }

}
