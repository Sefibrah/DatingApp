import { AlertifyjsService } from './../services/alertifyjs.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyjsService) { }

  ngOnInit() {
  }
  register(input: any) {
    this.authService.register(input)
      .subscribe(
        next => {
          this.alertify.success("Registered successfully")
          this.router.navigate([''])
        },
        exception => {
          this.alertify.error(exception)
        }
      )
  }
}
