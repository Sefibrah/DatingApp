import { AuthService } from './../../../services/auth.service';
import { UserService } from './../../../services/user.service';
import { NgForm } from '@angular/forms';
import { AlertifyjsService } from './../../../services/alertifyjs.service';
import { ActivatedRoute } from '@angular/router';
import { User } from './../../../models/user';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user: User
  @ViewChild('editForm') editForm: NgForm
  @HostListener("window:beforeunload",['$event'])
  unloadNotification($event: any){
    if(!this.editForm.submitted && this.editForm.dirty)
      $event.returnValue = true;
  }
  constructor(private route: ActivatedRoute, private alertify: AlertifyjsService, private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => this.user = data['user'])
  }
  updateUser(){
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next=>{
      this.alertify.success("User was successfuly updated!")
      this.editForm.reset(this.user);
    }, error => this.alertify.error(error))
  }
}
