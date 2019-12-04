import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './state/auth.service';
import { MessageService } from '../messages/state/message.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard  implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService,
              private messageService: MessageService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.user) {
        this.messageService.addError('User is not logged in');

        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    } else {
      return true;
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }

}