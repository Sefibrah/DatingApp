import { AuthService } from './auth.service';
import { Photo } from './../models/photo';
import { environment } from './../../environments/environment';
import { User } from './../models/user';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class UserService {
    baseUrl = environment.apiUrl + 'users/'
    mainPhotoUpdated = new Subject<any>()
    constructor(private http: HttpClient, private authService: AuthService) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl)
    }

    getUser(id: number): Observable<User> {
        return this.http.get<User>(this.baseUrl + id)
    }

    updateUser(id: number, user: User) {
        return this.http.put(this.baseUrl + id, user)
    }

    setMainPhoto(userId: number, id: number) {
        return this.http.post(this.baseUrl + userId + '/photos/' + id + '/setMain', {})
    }

    deletePhoto(userId: number, id: number) {
        return this.http.delete(this.baseUrl + userId + '/photos/' + id)
    }
}