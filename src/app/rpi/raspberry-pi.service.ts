import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface RaspberryPi {
  id: string;
  ownerId: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class RaspberryPiService {

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) { }

  findAllByOwner(): Observable<RaspberryPi[]> {
    return this.auth.user.pipe(switchMap(user =>
      this.firestore.collection<RaspberryPi>('raspberryPis', ref => ref.where('ownerId', '==', user.uid))
        .valueChanges()
    ));
  }

  save(raspberryPi: RaspberryPi) {
    this.firestore.collection('raspberryPis').doc(raspberryPi.id)
      .update({
        ownerId: raspberryPi.ownerId,
        name: raspberryPi.name
      })
      .catch(err => console.log(err));
  }
}
