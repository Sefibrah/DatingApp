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

  constructor(public authService: AuthService, private alertify: AlertifyjsService, private router: Router) { }

  ngOnInit() {
  }

  login(input: any) {
    this.authService.login(input).subscribe(
      next => {
        this.alertify.success("Logged in successfully!")
      },
      error => {
        this.alertify.error(error)
      }, () => {
        this.router.navigate(['/members'])
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
