import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = 'http://localhost:5000/api/auth/';
  jwtHelper = new JwtHelperService()
  decodedToken: any

  constructor(private http: HttpClient) { }
  getValues() {
    this.http.get('http://localhost:5000/api/values');
  }
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
  register(input: any) {
    return this.http.post(this.baseUrl + 'register', input)
  }
  loggedIn(){
    const token = localStorage.getItem('token')
    return !this.jwtHelper.isTokenExpired(token)
  }
}
