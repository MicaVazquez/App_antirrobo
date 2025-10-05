import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { DeviceMotion } from '@awesome-cordova-plugins/device-motion/ngx';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'appuno-19196',
        appId: '1:738375225173:web:8011f9ed9f961dddf2a9dc',
        storageBucket: 'appuno-19196.appspot.com',
        apiKey: 'AIzaSyC1p5VBOl8qBMYA1kHettA57BwuV-6yQ5g',
        authDomain: 'appuno-19196.firebaseapp.com',
        messagingSenderId: '738375225173',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    importProvidersFrom(
      AngularFireModule.initializeApp({
        projectId: 'appuno-19196',
        appId: '1:738375225173:web:8011f9ed9f961dddf2a9dc',
        storageBucket: 'appuno-19196.appspot.com',
        apiKey: 'AIzaSyC1p5VBOl8qBMYA1kHettA57BwuV-6yQ5g',
        authDomain: 'appuno-19196.firebaseapp.com',
        messagingSenderId: '738375225173',
      })
    ),
    Flashlight,
    Vibration,
    DeviceMotion,
  ],
});
