import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt'
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/'
  jwtHelper = new JwtHelperService()
  loggedInUser = new Subject<User>()
  decodedToken: any = null
  user: User

  constructor(private http: HttpClient, private userService: UserService) { }
  login(input: any) {
    return this.http.post(this.baseUrl + 'login', input).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          this.decodedToken = this.jwtHelper.decodeToken(user.token)
        }
      })
    );
  }
  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user)
  }
  loggedIn() {
    const token = localStorage.getItem('token')
    return !this.jwtHelper.isTokenExpired(token)
  }
}
