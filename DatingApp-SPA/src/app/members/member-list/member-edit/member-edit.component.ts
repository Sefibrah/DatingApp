import { Photo } from './../../../models/photo';
import { environment } from './../../../../environments/environment';
import { AuthService } from './../../../services/auth.service';
import { UserService } from './../../../services/user.service';
import { NgForm } from '@angular/forms';
import { AlertifyjsService } from './../../../services/alertifyjs.service';
import { ActivatedRoute } from '@angular/router';
import { User } from './../../../models/user';
import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit, OnDestroy {
  photos: Photo[]
  uploader: FileUploader
  hasBaseDropZoneOver = false
  user: User
  currentMain: Photo
  mainPhotoThumbnail: string
  mainPhotoUpdatedSub: Subscription
  @ViewChild('editForm') editForm: NgForm
  @HostListener("window:beforeunload", ['$event'])
  unloadNotification($event: any) {
    if (!this.editForm.submitted && this.editForm.dirty)
      $event.returnValue = true;
  }
  constructor(private route: ActivatedRoute,
    private alertify: AlertifyjsService,
    private userService: UserService,
    private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user']
      this.photos = this.user.photos
      this.mainPhotoThumbnail = this.user.photoUrl
    })
    this.mainPhotoUpdatedSub = this.userService.mainPhotoUpdated.subscribe(img => this.mainPhotoThumbnail = img)
    this.authService.loggedInUser.next(this.user)
    this.initializeUploader()
  }
  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      this.alertify.success("User was successfuly updated!")
      this.editForm.reset(this.user);
    }, error => this.alertify.error(error))
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: environment.apiUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    })
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false }
    this.uploader.onSuccessItem = (file, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response)
        const photo: Photo = {
          id: res.id,
          isMain: res.isMain,
          url: res.url,
          description: res.description,
          dateAdded: res.dateAdded
        }
        if (photo.isMain) {
          this.userService.mainPhotoUpdated.next(photo.url)
        }
        this.photos.push(photo)
      }
    }
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(
      () => {
        this.currentMain = this.photos.filter(p => p.isMain == true)[0]
        this.currentMain.isMain = false
        photo.isMain = true
        this.userService.mainPhotoUpdated.next(photo.url)
      },
      error => console.log(error)
    )
  }

  deletePhoto(photo: Photo) {
    this.userService.deletePhoto(this.authService.decodedToken.nameid, photo.id).subscribe(
      () => this.photos.slice(this.photos.indexOf(photo), 1),
      error => console.log(error)
    )
  }
  ngOnDestroy() {
    this.mainPhotoUpdatedSub.unsubscribe()
  }
}
