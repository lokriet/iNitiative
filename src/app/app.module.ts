import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserModule, EventManager } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { CustomEventManager } from './custom-event-manager';
import { EncounterModule } from './encounter/encounter.module';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SetupModule } from './setup/setup.module';

// import { SelectListComponent } from './encounter/encounter-play/select-list/select-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    MessagesComponent,
    HeaderComponent,
    // SelectListComponent
  ],
  imports: [
    BrowserModule,

    // all other app modules before routing
    AuthModule,
    EncounterModule,
    SetupModule,

    AppRoutingModule,

    // firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireStorageModule,
    // akita
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    AkitaNgRouterStoreModule.forRoot(),

    // other add-ons
    FontAwesomeModule,
    BrowserAnimationsModule,
    NoopAnimationsModule
  ],
  providers: [AuthGuard,  { provide: EventManager, useClass: CustomEventManager }],
  bootstrap: [AppComponent]
})
export class AppModule { }
