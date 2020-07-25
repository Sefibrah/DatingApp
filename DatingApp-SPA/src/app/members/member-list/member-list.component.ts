import { AuthService } from './../../services/auth.service';
import { Pagination } from './../../models/pagination';
import { User } from './../../models/user';
import { UserService } from './../../services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[]
  user: User
  userParams: any = [{ minAge: 18, maxAge: 99, gender: 'female' }]
  genders = [
    { value: "male", name: "Males" },
    { value: "female", name: "Females" }
  ];
  pagination: Pagination
  constructor(private route: ActivatedRoute, private authService: AuthService, private userService: UserService) {
  }
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result
      this.pagination = data['users'].pagination
    })
    this.userService.getUser(this.authService.decodedToken.nameid).subscribe(
      user => this.user = user,
      () => { },
      () => {
        this.userParams.minAge = 18
        this.userParams.maxAge = 99
        this.userParams.gender = this.user.gender == 'male' ? 'female' : 'male'
      })
  }
  loadUsers(created?: string) {
    this.userService.getUsers(this.pagination.currentPage, 
      this.pagination.pageSize, this.userParams, created).subscribe(
      res => {
        this.users = res.result
        this.pagination = res.pagination
      }
    )
  }
  resetFilters() {
    this.userParams.minAge = 18
    this.userParams.maxAge = 99
    this.userParams.gender = this.user.gender == 'male' ? 'female' : 'male'
    this.loadUsers()
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page
    this.loadUsers()
  }
}
