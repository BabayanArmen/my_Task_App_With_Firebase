import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router,
              private firebaseAuth: AngularFireAuth) { }

  logIn(email, password) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.firebaseAuth.signOut()
      .then((res) => {
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
        this.router.navigateByUrl('/');
      })
  }

  register(email, password) {
    return this.firebaseAuth.createUserWithEmailAndPassword(email, password);
  }

}
