import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  currentDate: string;
  myTask: string;
  today = new Date().toLocaleDateString();
  addTask: boolean;
  tasks = [] as any;



  constructor(public afDB: AngularFireDatabase) {
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    this.currentDate = date.toLocaleDateString('fr-FR');
    this.getTasks();
  }

  addTaskToFirebase() {
    console.log('myTask : ' + this.myTask + ' date : ' + this.today);
    this.afDB.list('Todo/').push({
      text: this.myTask,
      date: this.today,
      checked: false
    });
    this.showForm();

  }

  showForm() {
    this.addTask = !this.addTask;
    this.myTask = '';
  }

  getTasks() {
    this.afDB.list('Todo'). snapshotChanges(['child_added', 'child_removed']).subscribe(actions => {
      this.tasks= [] ;
      actions.forEach(action => {
        console.log('Tâches : ' + action.payload.exportVal().text);
        this.tasks.push({
          key: action.key,
          text: action.payload.exportVal().text,
          date: action.payload.exportVal().date,
          checked: action.payload.exportVal().checked
        });
      });
    });
  }

  changeCheckState(ev: any) {
    console.log('checked: ' + ev.checked);
    this.afDB.object('Todo/' + ev.key + '/checked/').set(ev.checked);
  }

  deleteTask(task: any) {
    this.afDB.list('Todo/').remove(task.key);
  }

}
