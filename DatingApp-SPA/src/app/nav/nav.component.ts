import { User } from './../models/user';
import { UserService } from './../services/user.service';
import { AlertifyjsService } from './../services/alertifyjs.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm
  mainPhoto: string

  constructor(public authService: AuthService,
    private alertify: AlertifyjsService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
    if (this.authService.decodedToken != null) {
      this.userService.getUser(this.authService.decodedToken.nameid).subscribe(
        user => {
          this.mainPhoto = user.photoUrl
          this.authService.loggedInUser.next(user)
        }
      )
    }
    this.authService.loggedInUser.subscribe((user: User) => {
      this.mainPhoto = user.photoUrl
    })
    this.userService.mainPhotoUpdated.subscribe(image => this.mainPhoto = image)
  }

  login(input: any) {
    this.authService.login(input).subscribe(
      () => {
        this.alertify.success("Logged in successfully!")
        this.userService.getUser(this.authService.decodedToken.nameid).subscribe(
          user => {
            this.mainPhoto = user.photoUrl
            this.authService.loggedInUser.next(user)
          }
        )

        this.router.navigate(['/member-list'])
      },
      error => {
        this.alertify.error(error)
      }, () => {
        this.router.navigate(['/member-list'])
      }
    )
  }
  loggedIn() {
    return this.authService.loggedIn()
  }
  logout() {
    localStorage.removeItem('token')
    this.router.navigate([''])
    this.alertify.message("Logged out!")
  }
}
