import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  lockClosed,
  logoIonic,
  logOutOutline,
  mail,
  pause,
  personOutline,
  playCircle,
} from 'ionicons/icons';
import { person } from 'ionicons/icons';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({
      logoIonic,
      person,
      arrowBack,
      mail,
      lockClosed,
      personOutline,
      logOutOutline,
      playCircle,
      pause,
    });
  }
}
