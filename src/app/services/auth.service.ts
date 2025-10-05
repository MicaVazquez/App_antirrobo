import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private authF: AngularFireAuth, public router: Router) {}

  getUserLogged() {
    return this.authF.authState;
  }
  getUser() {
    return this.authF.currentUser;
  }
  async login(email: string, password: string) {
    return await this.authF.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.authF.signOut().then(() => this.router.navigate(['login']));
  }
}
