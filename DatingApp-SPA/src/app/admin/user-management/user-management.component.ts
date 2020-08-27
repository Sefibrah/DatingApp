import { EditRolesModalComponent } from './../edit-roles-modal/edit-roles-modal.component';
import { User } from './../../models/user';
import { AdminService } from './../../services/admin.service';
import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[]
  modalRef: BsModalRef;
  constructor(private adminService: AdminService, private modalService: BsModalService) { }

  ngOnInit() {
    this.adminService.getUsersWithRoles().subscribe(
      (users: User[]) => this.users = users
    )
  }

  editRolesModal(user: User) {
    const initialState = {
      user,
      roles: this.getRolesFromUser(user)
    }
    this.modalRef = this.modalService.show(EditRolesModalComponent, { initialState })
    this.modalRef.content.updateSelectedRoles.subscribe(roles => {
      const rolesToUpdate = {
        roleNames: [...roles.filter(role => role.checked == true).map(role => role.name)]
      }
      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user, rolesToUpdate.roleNames).subscribe(
          () => user.roles = [...rolesToUpdate.roleNames],
          error => console.log(error)
        )
      }
    })
  }

  getRolesFromUser(user: User) {
    const roles = []
    const userRoles = user.roles
    const availableRoles = [
      { name: 'Admin', value: 'Admin', checked: false },
      { name: 'Moderator', value: 'Moderator', checked: false },
      { name: 'Member', value: 'Member', checked: false },
      { name: 'VIP', value: 'VIP', checked: false }
    ]
    for (let i = 0; i < availableRoles.length; i++) {
      let isMatch = false
      for (let j = 0; j < userRoles.length; j++) {
        if (availableRoles[i].name === userRoles[j]) {
          isMatch = true
          availableRoles[i].checked = true
          roles.push(availableRoles[i])
          break;
        }
      }
      if (!isMatch) {
        availableRoles[i].checked = false
        roles.push(availableRoles[i])
      }
    }
    return roles
  }
}


