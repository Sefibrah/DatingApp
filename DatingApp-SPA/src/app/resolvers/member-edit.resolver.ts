import { AuthService } from './../services/auth.service';
import { AlertifyjsService } from './../services/alertifyjs.service';
import { catchError } from 'rxjs/operators';
import { UserService } from './../services/user.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class MemberEditResolver implements Resolve<User> {
    constructor(private userService: UserService, private alertify: AlertifyjsService, private router: Router, private authService: AuthService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<User> | Promise<User> | User {
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                this.alertify.error("We couldn't load the requested user, therefore you were redirected to the members page!")
                this.router.navigate(['/member-list'])
                return of(null)
            })
        );
    }
}