import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-rpi',
  templateUrl: './rpi.component.html',
  styleUrls: ['./rpi.component.css']
})
export class RpiComponent implements OnInit {

  userId: string;

  id: string;
  name: string;

  pis: Observable<any[]>;

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) {
    this.auth.user.subscribe(user => {
      this.userId = user.uid;
      this.pis = firestore.collection('raspberryPis', ref => ref.where('ownerId', '==', this.userId)).valueChanges();
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.id);
    const doc = this.firestore.collection('raspberryPis').doc(this.id);
    doc.update({
      ownerId: this.userId,
      name: this.name
    }).catch(err => console.log(err));
  }
}
