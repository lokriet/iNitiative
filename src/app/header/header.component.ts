import { Component, OnInit, OnDestroy } from '@angular/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/state/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  arrowDownIcon = faCaretDown;

  private sub: Subscription;

  dropdownOpen = false;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.sub = this.authService.sync().subscribe();
  }

  isAuthenticated() {
    return !!this.authService.user;
  }

  onLogout() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  username() {
    return this.authService.user.email;
  }
}
