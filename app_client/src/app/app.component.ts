import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, UserService } from './_services';
import { User } from './_models';

import './_content/app.less';
import { first } from 'rxjs/internal/operators/first';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}