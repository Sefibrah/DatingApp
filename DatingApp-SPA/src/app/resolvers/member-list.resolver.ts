import { AlertifyjsService } from './../services/alertifyjs.service';
import { catchError } from 'rxjs/operators';
import { UserService } from './../services/user.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class MemberListResolver implements Resolve<User[]> {
    pageNumber = 1
    pageSize = 5
    constructor(private userService: UserService, private alertify: AlertifyjsService, private router: Router) { }
    resolve(route: ActivatedRouteSnapshot): Observable<User[]> | Promise<User[]> | User[] {
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error("We couldn't load the requested users, therefore you were redirected to the home page!")
                this.router.navigate(['/home'])
                return of(null)
            })
        );
    }
}