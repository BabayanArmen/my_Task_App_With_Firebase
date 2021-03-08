import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) { }

  addUserCollection(uid) {
    return this.firestore.collection('users').add({
      userID: uid
    })
  }

  getUserProjects(id) {
    let projects = this.firestore.collection('projects', ref => {
      return ref
        .where('userID', '==', id )
    });
    return projects.snapshotChanges();
  }

  getProjectTasks(projectID) {
    let tasks = this.firestore.collection('tasks', ref => {
      return ref
      .where('projectID', '==', projectID)
    });
    return tasks.snapshotChanges();
  }

  onAddNewProject(projectTitle, userID) {
    return this.firestore.collection('projects').add({
      projectTitle,
      userID
    })
  }

  onRemoveProject(id) {
    return this.firestore.doc('projects/'+id).delete();
  }

  getTasks() {
    return this.firestore.collection('tasks').snapshotChanges();
  }

  onAddTask(projectID, userID, title) {
    return this.firestore.collection('tasks').add({
      projectID,
      userID,
      title,
      status: 'started'
    })
  };

  onEdit(task:Task, value) {
    return this.firestore.doc('tasks/'+task.id).update({title: value});
  };

  onRemove(task) {
    return this.firestore.doc('tasks/'+task.id).delete();
  }

  chageStatus(taskId, value) {
    return this.firestore.doc('tasks/'+taskId).update({status: value});
  }

}
