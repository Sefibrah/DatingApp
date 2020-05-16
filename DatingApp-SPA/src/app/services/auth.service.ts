import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = 'http://localhost:5000/api/auth/';
  loggedUser = new Subject<any>()
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
        }
        this.loggedUser.next(input)
      })
    );
  }
  register(input: any) {
    return this.http.post(this.baseUrl + 'register', input)
  }
}
