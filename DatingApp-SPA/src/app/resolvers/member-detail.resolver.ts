import { AlertifyjsService } from './../services/alertifyjs.service';
import { catchError } from 'rxjs/operators';
import { UserService } from './../services/user.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class MemberDetailResolver implements Resolve<User> {
    constructor(private userService: UserService, private alertify: AlertifyjsService, private router: Router) { }
    resolve(route: ActivatedRouteSnapshot): Observable<User> | Promise<User> | User {
        return this.userService.getUser(+route.params['id']).pipe(
            catchError(error => {
                this.alertify.error("We couldn't load the requested user, therefore you were redirected to the members page!")
                this.router.navigate(['/members'])
                return of(null)
            })
        );
    }
}