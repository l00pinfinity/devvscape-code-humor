import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirebaseApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { authReducer } from './core/store/reducers/auth.reducer';
import { AuthEffects } from './core/store/effects/auth.effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { OnlineStatusModule } from 'ngx-online-status';
import { ImageEffects } from './core/store/effects/image.effects';
import { imageReducer } from './core/store/reducers/image.reducer';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';


export function initializeFirebaseApp(): FirebaseApp {
  return initializeApp(environment.firebaseConfig);
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, OnlineStatusModule, HttpClientModule, TranslocoRootModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    provideFirebaseApp(() => initializeFirebaseApp()),
    provideAuth(() => getAuth()), 
    provideAnalytics(() => getAnalytics()), 
    provideFirestore(() => getFirestore()), 
    provideStorage(() => getStorage()),
    provideMessaging(() => getMessaging()), 
    providePerformance(() => getPerformance()),
    provideStore({auth:authReducer, image:imageReducer}), 
    provideEffects(AuthEffects, ImageEffects),
    provideState({ name: 'auth', reducer: authReducer}),
    provideState({ name: 'image', reducer: imageReducer}),
    ScreenTrackingService, 
    UserTrackingService, 
    AndroidPermissions,
    InAppBrowser
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
