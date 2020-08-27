import { Subject } from 'rxjs';
import { User } from './../../models/user';
import { Component, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-roles-modal',
  templateUrl: './edit-roles-modal.component.html',
  styleUrls: ['./edit-roles-modal.component.css']
})
export class EditRolesModalComponent {
  @Output() updateSelectedRoles = new Subject()
  user: User
  roles: any[]
  constructor(public modalRef: BsModalRef) { }
  updateRoles(){
    this.updateSelectedRoles.next(this.roles)
    this.modalRef.hide()
  }
}

