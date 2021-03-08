import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/shared/models/task.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  UID: string;
  projectID: string;
  tasks: Task[] = [];
  newTask:string;
  currentTaskID: string
  currentTaskStatus: string;

  isDarkTheme:boolean = false;

  constructor(private activatedRoute:ActivatedRoute,
              private authService: AuthService,
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
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.projectID = params.projectID;

      this.firebaseService.getProjectTasks(this.projectID)
        .subscribe((actionArray) => {
          this.tasks = actionArray.map(item => {
            return {
              id: item.payload.doc.id,
              data: item.payload.doc.data()
            } as Task;
          })
          console.log(this.tasks);
        })
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

  /////////////// drag and drop ////////////
  allowDrop(event) {
    // console.log(event.target.id);
    if((event.target.id == 'started') || (event.target.id == 'inProgress') || (event.target.id == 'done')) {
      event.preventDefault();
    }else {
      return;
    }
  }
  drag(event, taskStatus) {
    // console.log('task id ', event.target.id);
    this.currentTaskID = event.target.id;
    this.currentTaskStatus = taskStatus;
    event.dataTransfer.setData("text", event.target.id);
  }
  drop(event) {
    // console.log('div id ', event.target.id);
    this.changeStatus(event.target.id);
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
  }
  ////////////////////////////////////////////
  changeStatus(status) {
    if(this.currentTaskStatus == 'inProgress' && status == 'started') {
      return;
    }
    if(this.currentTaskStatus == 'done' && (status == 'started' || status == 'inProgress')) {
      return;
    }
    this.firebaseService.chageStatus(this.currentTaskID, status)
    .then(res => console.log(res))
  }
  ////////////////////////////////////////////

  addTask() {
    let dublicate = this.tasks.find(el => el.data.title == this.newTask);
    if(dublicate) {
      this.openSnackBar('Task already exist', null)
      this.newTask = ''
      return;
    }
    this.firebaseService.onAddTask(this.projectID, this.UID, this.newTask)
      .then(res => console.log(res))
    this.newTask = ''
  };

  onEdit(task:Task, value) {
    this.firebaseService.onEdit(task, value)
      .then(res => console.log(res))
  };

  onRemove(task) {
    this.firebaseService.onRemove(task)
      .then(res => console.log(res))
  }

  onLogOut() {
    this.authService.logout();
  }

}
