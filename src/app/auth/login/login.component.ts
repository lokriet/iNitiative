import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../state/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/messages/state/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string;
  password: string;

  private sub: Subscription;
  returnUrl: string;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private messageService: MessageService) { }

  ngOnInit() {
    this.sub = this.authService.sync().subscribe();
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSignIn() {
    this.authService.signin(this.email, this.password)
    .then(value => {
      this.router.navigateByUrl(this.returnUrl);
    })
    .catch(error => {
      let errorMessage: string;

      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Wrong password';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User with this e-mail doesn\'t exist';
          break;
        default:
          console.log(error);
          errorMessage = 'Unknown error';
      }
      // idk?
      if (errorMessage) {
        this.messageService.addError(errorMessage);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
