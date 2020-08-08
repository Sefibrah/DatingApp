import { User } from './../../../models/user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User
  galleryOptions: NgxGalleryOptions[]
  galleryImages: NgxGalleryImage[]
  tabParam: number
  @ViewChild('staticTabs', { static: true }) staticTabs: TabsetComponent;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user']
    })
    this.route.queryParams.subscribe(
      params => {
        this.tabParam = params['tab']
        this.selectTab(this.tabParam)
      }
    )
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      {
        breakpoint: 400,
        preview: false
      }
    ];
    this.galleryImages = this.getImages()
  }
  getImages() {
    const gImages = []
    for (const photo of this.user.photos) {
      gImages.push(
        {
          small: photo.url,
          medium: photo.url,
          big: photo.url
        }
      )
    }
    return gImages
  }
  selectTab(id: number) {
    this.staticTabs.tabs[id].active = true;
  }
}
