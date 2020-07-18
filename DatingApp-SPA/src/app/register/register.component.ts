import { AlertifyjsService } from './../services/alertifyjs.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup
  minDate: Date
  maxDate: Date
  user: any
  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyjsService) { }

  ngOnInit() {
    this.minDate = new Date()
    this.maxDate = new Date()
    this.minDate.setFullYear(this.minDate.getFullYear() - 80);
    this.registerForm = new FormGroup({
      'gender': new FormControl("Male", [Validators.required]),
      'username': new FormControl("Jusuf Sefer", [Validators.required]),
      'knownAs': new FormControl("Jusuf", [Validators.required]),
      'dateOfBirth': new FormControl("1/1/2008", [Validators.required]),
      'passwords': new FormGroup({
        'password': new FormControl("password", [Validators.required, Validators.minLength(8)]),
        'confirmPassword': new FormControl("password", [Validators.required])
      }, [this.checkPasswords.bind(this)]),
      'city': new FormControl("Sarajevo", [Validators.required]),
      'country': new FormControl("Bosnia and Herzegovina", [Validators.required])
    })
  }
  register(input: any) {
    if (this.registerForm.valid) {
      const password = this.registerForm.get('passwords.password').value
      this.user = Object.assign({}, input)
      delete this.user.passwords
      this.user.password = password
      this.authService.register(this.user).subscribe(
        () => this.alertify.success("Registered successfully"),
        exception => this.alertify.error(exception),
        () => this.authService.login(this.user).subscribe(() => this.router.navigate(['/member-list']))
      )
    }
  }
  checkPasswords(controls: FormGroup): { [s: string]: boolean } {
    const password = controls.get('password').value
    const confirm = controls.get('confirmPassword').value
    return password == confirm ? null : { notSame: true }
  }
}
