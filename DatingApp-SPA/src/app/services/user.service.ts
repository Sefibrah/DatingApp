import { environment } from './../../environments/environment';
import { User } from './../models/user';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };
@Injectable({providedIn:'root'})
export class UserService {
    baseUrl = environment.apiUrl + 'users/'

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl, httpOptions)
    }

    getUser(id: number): Observable<User> {
        return this.http.get<User>(this.baseUrl + id, httpOptions)
    }
}