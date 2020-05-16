import { HttpClient } from '@angular/common/http';
import { AuthService } from './../services/auth.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild('loginForm') loginForm: NgForm
  user:any = null
  loggedUserSubscription: Subscription

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit() {
    this.loggedUserSubscription = this.authService.loggedUser.subscribe(user => {
      this.user = user
      console.log(this.user)
    })
  }

  login(input: any) {
    this.authService.login(input).subscribe(
      next => {
        console.log("Logged in successfully")
      },
      error => {
        console.log("Oops! Something's not right...")
      }
    )
  }
  logout() {
    this.user = null
  }
  ngOnDestroy(){
    this.loggedUserSubscription.unsubscribe()
  }
}
