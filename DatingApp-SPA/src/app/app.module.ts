import { EditRolesModalComponent } from './admin/edit-roles-modal/edit-roles-modal.component';
import { HasRoleDirective } from './directives/hasRole.directive';
import { MessagesChatComponent } from './members/member-list/member-detail/messages-chat/messages-chat.component';
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
import { TimeagoModule } from 'ngx-timeago';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';

import { JwtModule } from '@auth0/angular-jwt';
import { FileUploadModule } from 'ng2-file-upload';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';

export function tokenGetter() {
   return localStorage.getItem("token");
}

@NgModule({
   declarations: [
      EditRolesModalComponent,
      HasRoleDirective,
      AppComponent,
      NavComponent,
      RegisterComponent,
      HomeComponent,
      PageNotFoundComponent,
      MessagesComponent,
      MemberComponent,
      MemberListComponent,
      ListsComponent,
      MemberEditComponent,
      MemberDetailComponent,
      MessagesChatComponent,
      AdminPanelComponent,
      UserManagementComponent,
      PhotoManagementComponent
   ],
   imports: [
      TabsModule.forRoot(),
      BrowserModule,
      CommonModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      RoutesModule,
      BrowserAnimationsModule,
      NgxGalleryModule,
      FileUploadModule,
      ModalModule.forRoot(),
      PaginationModule.forRoot(),
      TimeagoModule.forRoot(),
      BsDatepickerModule.forRoot(),
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
   ],
   entryComponents: [
      EditRolesModalComponent
   ],
})
export class AppModule {
}
