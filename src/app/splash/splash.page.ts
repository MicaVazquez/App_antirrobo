import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class SplashPage implements OnInit {
  router_service = inject(Router);

  constructor(private platform: Platform) {}

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      SplashScreen.hide().then(() => {
        setTimeout(() => {
          this.router_service.navigate(['login']);
        }, 3000);
      });
    });
  }

  ngOnInit() {}
}
