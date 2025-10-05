import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { Motion, AccelListenerEvent } from '@capacitor/motion';
import Swal from 'sweetalert2';
import { Usuario } from '../models/usuario';
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

import { AuthService } from '../services/auth.service';
import { NgIf, NgStyle } from '@angular/common';
import {
  DeviceMotion,
  DeviceMotionAccelerationData,
} from '@awesome-cordova-plugins/device-motion/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    // IonHeader,
    // IonToolbar,
    // IonTitle,
    IonContent,
    NgIf,
    NgStyle,
  ],
})
export class HomePage {
  presionado: boolean = false;
  clave = '';
  audioIzquierda = '../../../assets/sonidos/1.mp3';
  audioDerecha = '../../../assets/sonidos/2.mp3';
  audioVertical = '../../../assets/sonidos/3.mp3';
  audioHorizontal = '../../../assets/sonidos/4.mp3';
  audio = new Audio();
  subscription: any;
  primerIngreso: boolean = true;
  primerIngresoFlash: boolean = true;
  posicionActualCelular = 'plano';
  posicionAnteriorCelular = 'plano';
  accelerationX: any;
  accelerationY: any;
  accelerationZ: any;
  pausar: boolean = false;
  motionListener: any;

  constructor(
    private auth: AuthService,
    private flashlight: Flashlight,
    private vibration: Vibration,
    private deviceMotion: DeviceMotion
  ) {}

  async btnActivarODesactivar() {
    if (this.presionado) {
      let esValido = await this.mostrarIngresoContrasenia();
      if (esValido) {
        this.mensaje('Alarma desactivada', 'success');
        setTimeout(() => {
          this.parar();
        }, 1000);
      } else if (this.clave !== '') {
        this.mensaje('Contraseña incorrecta', 'error');
        this.vibration.vibrate(5000);
        this.audio.src = this.audioIzquierda;
        this.audio.play();
        this.flashlight.switchOn();
        setTimeout(() => {
          this.flashlight.switchOff();
          this.audio.src = '';
        }, 5000);
      }
    } else {
      this.presionado = true;
      this.mensaje('Alarma activada', 'success');
      console.log('Alarma activada');
      this.comenzar();
    }
  }

  mensaje(mensaje: any, icono: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: icono,
      title: mensaje,
    });
  }

  async mostrarIngresoContrasenia() {
    let esValido = false;
    this.clave = '';
    const result = await Swal.fire({
      position: 'center',
      title: 'Ingrese su clave',
      input: 'password',
      heightAuto: false,
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'DESACTIVAR',
      cancelButtonText: 'CANCELAR',
      showLoaderOnConfirm: true,
      preConfirm: (clave) => {
        this.clave = clave;

        let usuario = localStorage.getItem('user');
        if (usuario) {
          let usuarioParseado = JSON.parse(usuario);
          if (usuarioParseado)
            esValido = String(usuarioParseado.clave) === clave;
          console.log(clave);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
    return esValido;
  }

  // parar() {
  //   this.presionado = false;
  //   this.clave = '';
  //   this.audio.pause();
  //   this.primerIngreso = true;
  //   Motion.removeAllListeners();
  // }
  parar() {
    this.presionado = false;
    this.clave = '';
    this.audio.pause();
    this.primerIngreso = true;
    this.subscription.unsubscribe();
  }

  comenzar() {
    this.subscription = this.deviceMotion
      .watchAcceleration({ frequency: 300 })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.accelerationX = Math.floor(acceleration.x);
        this.accelerationY = Math.floor(acceleration.y);
        this.accelerationZ = Math.floor(acceleration.z);
        this.posicionAnteriorCelular = this.posicionActualCelular;

        if (acceleration.x > 5) {
          //Inclinacion Izquierda

          this.posicionActualCelular = 'izquierda';
          this.movimientoIzquierda();
        } else if (acceleration.x < -5) {
          //Inclinacion Derecha

          this.posicionActualCelular = 'derecha';
          this.movimientoDerecha();
        } else if (acceleration.y >= 9) {
          //encender flash por 5 segundos y sonido
          this.posicionActualCelular = 'arriba';

          if (this.posicionActualCelular != this.posicionAnteriorCelular) {
            this.audio.src = this.audioVertical;
            this.posicionAnteriorCelular = 'arriba';
            this.pausar = false;
          }

          if (!this.pausar) this.audio.play();

          this.movimientoVertical();
        } else if (
          acceleration.z >= 9 &&
          acceleration.y >= -1 &&
          acceleration.y <= 1 &&
          acceleration.x >= -1 &&
          acceleration.x <= 1
        ) {
          //acostado vibrar por 5 segundos y sonido
          this.posicionActualCelular = 'plano';
          this.movimientoHorizontal();
        }
      });
  }
  // async comenzar() {
  //   console.log('Entró a comenzar');
  //   this.motionListener = await Motion.addListener(
  //     'accel',
  //     (event: AccelListenerEvent) => {
  //       this.accelerationX = Math.floor(event.acceleration.x);
  //       this.accelerationY = Math.floor(event.acceleration.y);
  //       this.accelerationZ = Math.floor(event.acceleration.z);

  //       if (this.accelerationX > 3) {
  //         this.posicionActualCelular = 'izquierda';
  //         this.movimientoIzquierda();
  //       } else if (this.accelerationX < -3) {
  //         this.posicionActualCelular = 'derecha';
  //         this.movimientoDerecha();
  //       } else if (this.accelerationY >= 3) {
  //         this.posicionActualCelular = 'arriba';
  //         if (this.posicionActualCelular !== this.posicionAnteriorCelular) {
  //           this.audio.src = this.audioVertical;
  //           this.posicionAnteriorCelular = 'arriba';
  //         }
  //         this.audio.play();
  //         this.movimientoVertical();
  //       } else if (
  //         this.accelerationZ >= 3 &&
  //         this.accelerationY >= -1 &&
  //         this.accelerationY <= 1 &&
  //         this.accelerationX >= -1 &&
  //         this.accelerationX <= 1
  //       ) {
  //         this.posicionActualCelular = 'plano';
  //         this.movimientoHorizontal();
  //       }
  //     }
  //   );
  // }

  movimientoIzquierda() {
    this.primerIngreso = false;
    this.primerIngresoFlash = true;
    if (this.posicionActualCelular !== this.posicionAnteriorCelular) {
      this.audio.src = this.audioIzquierda;
      this.audio.play();
    }
  }

  movimientoDerecha() {
    this.primerIngreso = false;
    this.primerIngresoFlash = true;
    if (this.posicionActualCelular !== this.posicionAnteriorCelular) {
      this.audio.src = this.audioDerecha;
      this.audio.play();
    }
  }

  movimientoVertical() {
    if (this.primerIngresoFlash) {
      this.flashlight.switchOn();
      // this.primerIngresoFlash ? this.flashlight.switchOn() : null;
      setTimeout(() => {
        this.primerIngresoFlash = false;
        this.flashlight.switchOff();
        this.pausar = true;
      }, 5000);
      this.primerIngreso = false;
    }
  }

  movimientoHorizontal() {
    this.primerIngreso = false;
    this.primerIngresoFlash = true;
    if (this.posicionActualCelular !== this.posicionAnteriorCelular) {
      this.audio.src = this.audioHorizontal;
      this.audio.play();
      this.vibration.vibrate(5000);
    }
  }

  cancelarDesactivar() {
    this.clave = '';
  }
  logOut() {
    localStorage.removeItem('user');
    this.auth.logout();
  }
}
