import { AlertifyjsService } from './../services/alertifyjs.service';
import { AuthService } from './../services/auth.service';
import { UserService } from './../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from './../models/pagination';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[]
  pagination: Pagination
  constructor(private route: ActivatedRoute, private userService: UserService,
    private authService: AuthService, private alertifyjs: AlertifyjsService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result
      this.pagination = data['users'].pagination
    })
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page
    this.loadUsers()
  }
  loadUsers(likeParams?) {
    this.userService.getUsers(this.pagination.currentPage,
      this.pagination.pageSize, null, null, likeParams).subscribe(
        res => {
          this.users = res.result
          this.pagination = res.pagination
        }
      )
  }
}
