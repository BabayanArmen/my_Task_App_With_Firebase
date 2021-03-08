import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  isDarkTheme:boolean = false;

  constructor(private authService: AuthService,
              private router:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('theme') == 'dark') {
      this.isDarkTheme = true;
    }else {
      this.isDarkTheme = false;
    }
  }

  setTheme() {
    localStorage.setItem('theme', this.isDarkTheme? 'dark':'light')
  }

  onSignIn() {
    this.authService.logIn(this.email, this.password)
    .then((res) => {
      localStorage.setItem('uid', res.user.uid);
      res.user.getIdToken().then((token) => {
        localStorage.setItem('token', token);
        this.router.navigateByUrl('projects');
      })
    })
  }

}
