import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
  register(input: any) {
    this.authService.register(input)
      .subscribe(
        next => {
          console.log("Registered successfully")
          this.router.navigate([''])
        },
        exception => {
          console.log(exception);
        }
      )
  }
}
