import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { MessagesResolver } from './resolvers/messages.resolver';
import { ListsResolver } from './resolvers/lists.resolver';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { MemberEditResolver } from './resolvers/member-edit.resolver';
import { MemberEditComponent } from './members/member-list/member-edit/member-edit.component';
import { MemberListResolver } from './resolvers/member-list.resolver';
import { MemberDetailResolver } from './resolvers/member-detail.resolver';
import { MemberDetailComponent } from './members/member-list/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { AuthGuard } from './guards/auth.guard';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'lists', component: ListsComponent, canActivate: [AuthGuard], resolve: { users: ListsResolver } },
    { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard], resolve: { messages: MessagesResolver } },
    { path: 'member-list', component: MemberListComponent, canActivate: [AuthGuard], resolve: { users: MemberListResolver } },
    { path: 'members/:id', component: MemberDetailComponent, canActivate: [AuthGuard], resolve: { user: MemberDetailResolver } },
    { path: 'member/edit', component: MemberEditComponent, canActivate: [AuthGuard], resolve: { user: MemberEditResolver }, canDeactivate: [PreventUnsavedChangesGuard] },
    { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard], data: { roles: ['Moderator', 'Admin'] } },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class RoutesModule { }