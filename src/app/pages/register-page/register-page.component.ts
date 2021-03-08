import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  email: string;
  password: string;

  isDarkTheme:boolean = false;

  constructor(private authService: AuthService,
              private firebaseService: FirebaseService,
              private router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('theme') == 'dark') {
      this.isDarkTheme = true;
    }else {
      this.isDarkTheme = false;
    }
  }

  onSingUp() {
    this.authService.register(this.email, this.password)
    .then((res) => {
      // console.log(res);
      // console.log(res.user.uid);
      this.firebaseService.addUserCollection(res.user.uid)
        .then(res => console.log(res))
      this.router.navigateByUrl('/')
    })
  }
}
