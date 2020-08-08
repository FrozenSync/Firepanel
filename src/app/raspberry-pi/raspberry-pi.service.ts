import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { RaspberryPi, RaspberryPiData } from './raspberry-pi';


@Injectable({
  providedIn: 'root'
})
export class RaspberryPiService {

  constructor(private authService: AuthService, private ngFirestore: AngularFirestore) { }

  findAllByOwner(): Observable<RaspberryPi[]> {
    const owner = this.authService.principal;
    const query = ref => ref.where('ownerId', '==', owner.uid);
    const resultSet = this.ngFirestore.collection<RaspberryPiData>('raspberryPis', query);

    return resultSet.snapshotChanges().pipe(
      map(changes =>
        changes.map(change => {
          const id = change.payload.doc.id;
          const data = change.payload.doc.data();

          return { id, data };
        })
      )
    );
  }

  register(id: string, name: string): void {
    const ownerId = this.authService.principal.uid;
    const registration = { id, data: { ownerId, name } };
    this.update(registration).catch(err => console.error(err));
  }

  update(raspberryPi: RaspberryPi): Promise<void> {
    return this.ngFirestore.collection(`raspberryPis`).doc(raspberryPi.id).set(raspberryPi.data);
  }

  unregister(raspberryPiId: string): Promise<void> {
    return this.ngFirestore.collection(`raspberryPis`).doc(raspberryPiId)
      .update({ ownerId: null });
  }
}
