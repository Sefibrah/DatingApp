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
    private alertify: AlertifyjsService) { }

  ngOnInit() {
    this.route.data.subscribe((data: PaginatedResult<Message[]>) => {
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
        }, error => this.alertify.error(error)
      )
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page
    this.loadMessages()
  }

  deleteMessage(message: Message) {
    this.alertify.confirm("Are you sure that you want to delete this message?", () => {
      this.userService.deleteMessage(message.id, this.authService.decodedToken.nameid).subscribe(
        () => this.messages.splice(this.messages.indexOf(message), 1),
        error => this.alertify.error(error)
      )
    })
  }
}
