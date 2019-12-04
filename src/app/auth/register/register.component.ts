import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/messages/state/message.service';

import { AuthService } from '../state/auth.service';
import { UserProfileService } from 'src/app/user/state/user-profile.service';
import { guid } from '@datorama/akita';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  email: string;
  password: string;
  username: string;

  private sub: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private messageService: MessageService,
              private userProfileService: UserProfileService) { }

  ngOnInit() {
    this.sub = this.authService.sync().subscribe();
  }

  onSignUp() {
    this.authService.signup(this.email, this.password)
      .then( value => {
        this.userProfileService.add({
          id: guid(),
          uid: value.user.uid,
          username: this.username
        });
        this.messageService.addInfo(`User ${this.username} created successfully`);
        this.router.navigate(['/']);
      })
      .catch(
      (errorMessage: string) => {
        console.log(errorMessage);
        this.messageService.addError('Failed to create a user!');
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
