import { AuthService } from './../services/auth.service';
import { Message } from './../models/message';
import { AlertifyjsService } from './../services/alertifyjs.service';
import { catchError } from 'rxjs/operators';
import { UserService } from './../services/user.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagesResolver implements Resolve<Message[]> {
    pageNumber = 1
    pageSize = 5
    messageContainer = "Unread"
    constructor(private userService: UserService,
        private alertify: AlertifyjsService,
        private authService: AuthService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> | Promise<Message[]> | Message[] {
        const userId = this.authService.decodedToken.nameid
        return this.userService.getUserMessages(userId, this.pageNumber,
            this.pageSize, this.messageContainer).pipe(
                catchError(error => {
                    this.alertify.error("We couldn't load the requested messages")
                    return of(null)
                })
            );
    }
}