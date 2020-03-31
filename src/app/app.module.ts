import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppCustomMaterialModule} from './app-custom-material.module';
import {FlexLayoutModule} from '@angular/flex-layout';


import {AngularFireMessagingModule} from '@angular/fire/messaging';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {environment} from '../environments/environment';


import {FirebaseService} from './services/firebase.service';
import {AdminResolver} from './admin/admin.resolver';
import {AuthGuard} from './services/auth.guard';
import {AuthService} from './services/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MessagingService} from './services/messaging.service';

import {AsyncPipe} from '../../node_modules/@angular/common';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgxMaskModule} from 'ngx-mask';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { BasicAuthInterceptor } from './services/auth.service';
import { ErrorInterceptor  } from './services/auth.service';

// components
import {AppComponent} from './app.component';
import {AdminComponent} from './admin/admin.component';
import {LoginComponent} from './login/login.component';
import {UserInvitationComponent} from './admin/user-invitation/user-invitation.component';
import {MeetingComponent} from './admin/meeting/meeting.component';
import {SendPushNotificationComponent} from './admin/send-push-notification/send-push-notification.component';
import {CreateGroupChatComponent} from './admin/create-group-chat/create-group-chat.component';
import {RegionsComponent} from './admin/regions/regions.component';
import {UserDeteleComponent} from './admin/user-detele/user-detele.component';
import {DialogBodyComponent} from './dialog-body/dialog-body.component';
import {DialogStatusComponent} from './dialog-status/dialog-status.component';
import { InviteComponent } from './invite/invite.component';

// pipes
import {JoinPipe} from './pipes.pipe';



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    LoginComponent,
    UserInvitationComponent,
    MeetingComponent,
    SendPushNotificationComponent,
    CreateGroupChatComponent,
    RegionsComponent,
    UserDeteleComponent,
    DialogBodyComponent,
    JoinPipe,
    DialogStatusComponent,
    InviteComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    AngularFireDatabaseModule, // for database
    // AngularFireModule.initializeApp(environment.firebase, 'my-app-name'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    BrowserAnimationsModule,
    AppCustomMaterialModule,
    FlexLayoutModule,
    NgxMaskModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
  ],
  providers: [
    AuthService,
    FirebaseService,
    AdminResolver,
    AuthGuard,
    MessagingService,
    AsyncPipe,
    {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogBodyComponent, DialogStatusComponent]
})
export class AppModule {
}
