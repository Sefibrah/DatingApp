import { AlertifyjsService } from './../services/alertifyjs.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm

  constructor(public authService: AuthService, private alertify: AlertifyjsService) { }

  ngOnInit() {
  }

  login(input: any) {
    this.authService.login(input).subscribe(
      next => {
        this.alertify.success("Logged in successfully!")
      },
      error => {
        this.alertify.error(error)
      }
    )
  }
  loggedIn(){
    return this.authService.loggedIn()
  }
  logout() {
    localStorage.removeItem('token')
    this.alertify.message("Logged out!")
  }
}
