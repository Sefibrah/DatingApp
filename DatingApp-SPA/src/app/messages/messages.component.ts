import { Pagination, PaginatedResult } from './../models/pagination';
import { Message } from './../models/message';
import { AlertifyjsService } from './../services/alertifyjs.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[]
  pagination: Pagination
  messageContainer: string = "Unread"

  constructor(private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private alertifyjs: AlertifyjsService) { }

  ngOnInit() {
    this.route.data.subscribe((data: PaginatedResult<Message[]>) => {
      console.log(data)
      this.messages = data['messages'].result
      this.pagination = data['messages'].pagination
    })
  }

  loadMessages(messageContainer?: string) {
    this.messageContainer = messageContainer
    this.userService.getUserMessages(this.authService.decodedToken.nameid,
      this.pagination.pageSize, this.pagination.currentPage, this.messageContainer).subscribe(
        (res: PaginatedResult<Message[]>) => {
          this.messages = res.result
          this.pagination = res.pagination
        }, error => this.alertifyjs.error(error)
      )
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page
    this.loadMessages()
  }
}
