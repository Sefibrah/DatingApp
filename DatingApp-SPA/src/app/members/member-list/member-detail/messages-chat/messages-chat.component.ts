import { User } from './../../../../models/user';
import { NgForm } from '@angular/forms';
import { Message } from './../../../../models/message';
import { AlertifyjsService } from './../../../../services/alertifyjs.service';
import { UserService } from './../../../../services/user.service';
import { AuthService } from './../../../../services/auth.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-messages-chat',
  templateUrl: './messages-chat.component.html',
  styleUrls: ['./messages-chat.component.css']
})
export class MessagesChatComponent implements OnInit {
  @Input('recipientId') recipientId: number
  userId: number
  messages: Message[]
  newMessage: any = {}
  @ViewChild('sendMessageForm') sendMessageForm: NgForm

  constructor(private authService: AuthService, private userService: UserService, private alertify: AlertifyjsService) { }

  ngOnInit() {
    this.userId = +this.authService.decodedToken.nameid
    this.loadMessagesThread()
  }

  loadMessagesThread() {
    this.userService.getUserMessagesThread(+this.authService.decodedToken.nameid, this.recipientId)
    .pipe(
      tap(messages=>{
        for (let i = 0; i < messages.length; i++) {
          const element = messages[i];
          this.markMessageAsRead(element.id, this.authService.decodedToken.nameid)
        }
      })
    )
    .subscribe(
      messages => this.messages = messages,
      error => this.alertify.error(error)
    )
  }
  sendMessage() {
    this.newMessage.recipientId = this.recipientId
    this.newMessage.content = this.sendMessageForm.value.message
    this.userService.sendMessage(this.userId, this.newMessage).subscribe((message: Message) => {
      this.messages.unshift(message)
    }, () => { },
      () => this.loadMessagesThread())

    this.sendMessageForm.reset()
  }
  deleteMessage(message: Message) {
    this.alertify.confirm("Are you sure that you want to delete this message?", () => {
      this.userService.deleteMessage(message.id, this.userId).subscribe(
        () => this.messages.splice(this.messages.indexOf(message), 1),
        error => this.alertify.error(error)
      )
    })
  }
  markMessageAsRead(id: number, userId: number){
    this.userService.markMessageAsRead(id, userId).subscribe(
      () => {},
      error => this.alertify.error(error)
    )
  }
}
