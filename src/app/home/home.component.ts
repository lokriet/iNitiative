import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/state/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  isLoggedIn() {
    return !!this.authService.user;
  }

  username() {
    return this.authService.user.email;
  }

}
