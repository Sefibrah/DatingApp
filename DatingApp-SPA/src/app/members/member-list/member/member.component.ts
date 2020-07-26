import { AlertifyjsService } from './../../../services/alertifyjs.service';
import { AuthService } from './../../../services/auth.service';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  @Input() user: User
  constructor(private userService: UserService, private authService: AuthService, private alertifyjs: AlertifyjsService) { }

  ngOnInit() {
  }
  sendLike(recipient: User) {
    this.userService.sendLike(+this.authService.decodedToken.nameid, recipient.id).subscribe(
      next => this.alertifyjs.success("You have liked " + recipient.knownAs),
      error => this.alertifyjs.error(error)
    )
  }
}
