import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AdminComponent} from './admin/admin.component';
import {UserInvitationComponent} from './admin/user-invitation/user-invitation.component';
import {AdminResolver} from './admin/admin.resolver';
import {AuthGuard} from './services/auth.guard';
import {MeetingComponent} from './admin/meeting/meeting.component';
import {SendPushNotificationComponent} from './admin/send-push-notification/send-push-notification.component';
import {CreateGroupChatComponent} from './admin/create-group-chat/create-group-chat.component';
import {RegionsComponent} from './admin/regions/regions.component';
import {UserDeteleComponent} from './admin/user-detele/user-detele.component';
import {InviteComponent} from './invite/invite.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'inv/ref/:id',
    component: InviteComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login/:id',
    component: LoginComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    resolve: {data: AdminResolver},
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AdminComponent,
      },
      {
        path: 'user-invitation',
        component: UserInvitationComponent,
      },
      {
        path: 'send-push-notification',
        component: SendPushNotificationComponent,
      },
      {
        path: 'meetings',
        component: MeetingComponent,
      },
      {
        path: 'group-chats',
        component: CreateGroupChatComponent,
      },
      {
        path: 'regions',
        component: RegionsComponent,
      },
      {
        path: 'users',
        component: UserDeteleComponent,
      }
    ]
  },
  { path: '**',
    component: LoginComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
