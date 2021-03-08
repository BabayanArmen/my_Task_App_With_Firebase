import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  UID: string;
  projects: any [];
  newProjetTitle: string;

  isDarkTheme:boolean = false;

  constructor(private authService: AuthService,
              private firebaseService: FirebaseService,
              private _snackBar: MatSnackBar
              ) { }

  ngOnInit(): void {
    if(localStorage.getItem('theme') == 'dark') {
      this.isDarkTheme = true;
    }else {
      this.isDarkTheme = false;
    }

    this.UID = localStorage.getItem('uid');
    this.firebaseService.getUserProjects(this.UID)
      .subscribe((actionArray) => {
        this.projects = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            data: item.payload.doc.data()
          }
        })
        // console.log(this.projects);
      })
  }

  setTheme() {
    localStorage.setItem('theme', this.isDarkTheme? 'dark':'light')
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onAddNewProject() {
    let dublicate = this.projects.find(el => el.data.projectTitle == this.newProjetTitle);
    if(dublicate) {
      this.openSnackBar('Project already exist', null)
      this.newProjetTitle = '';
      return;
    }
    this.firebaseService.onAddNewProject(this.newProjetTitle, this.UID)
      .then(res => console.log(res))
    this.newProjetTitle = '';
  }

  onRemoveProject(id) {
    this.firebaseService.onRemoveProject(id)
      .then(res => console.log(res));
  }

  onLogOut() {
    this.authService.logout();
  }

}
