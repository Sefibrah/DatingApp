import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { MemberEditComponent } from './members/member-list/member-edit/member-edit.component';
import { MemberDetailComponent } from './members/member-list/member-detail/member-detail.component';
import { MemberComponent } from './members/member-list/member/member.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ErrorInterceptorProvider } from './services/error.interceptor';
import { RoutesModule } from './routes';
import { AuthService } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { TabsModule } from 'ngx-bootstrap/tabs'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxGalleryModule } from 'ngx-gallery-9';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';

import { JwtModule } from '@auth0/angular-jwt';
import { FileUploadModule } from 'ng2-file-upload';

export function tokenGetter() {
   return localStorage.getItem("token");
}

@NgModule({
   declarations: [
      AppComponent,
      ValueComponent,
      NavComponent,
      RegisterComponent,
      HomeComponent,
      PageNotFoundComponent,
      MessagesComponent,
      MemberComponent,
      MemberListComponent,
      ListsComponent,
      MemberEditComponent,
      MemberDetailComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      RoutesModule,
      BrowserAnimationsModule,
      NgxGalleryModule,
      FileUploadModule,
      BsDatepickerModule.forRoot(),
      TabsModule.forRoot(),
      BsDropdownModule.forRoot(),
      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter,
            whitelistedDomains: ["localhost:5000"],
            blacklistedRoutes: ["localhost:5000/api/auth"],
         },
      })
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      PreventUnsavedChangesGuard
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {
}
