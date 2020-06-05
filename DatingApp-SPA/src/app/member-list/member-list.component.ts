import { User } from './../models/user';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent {
  users: User[]
  constructor(private userService: UserService) { }
  getUsers(){
    this.userService.getUsers().subscribe(users => this.users = users)
  }
}
