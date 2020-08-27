import { User } from './../models/user';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminService {
  baseUrl = environment.apiUrl + 'admin/'

  constructor(private http: HttpClient) { }

  getUsersWithRoles(){
    return this.http.get(this.baseUrl + 'userWithRoles')
  }

  updateUserRoles(user:User, roles: {}){
    return this.http.post(this.baseUrl + 'updateRoles/' + user.username, {roles})
  }
}

