import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { RaspberryPi, RaspberryPiData } from './raspberry-pi';


@Injectable({
  providedIn: 'root'
})
export class RaspberryPiService {

  constructor(private authService: AuthService, private ngFirestore: AngularFirestore) { }

  findAllByOwner(): Observable<RaspberryPi[]> {
    return this.authService.principal.pipe(
      switchMap(principal => {
        const query = ref => ref.where('ownerId', '==', principal.uid);
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
      })
    );
  }

  register(id: string, name: string): void {
    this.authService.principal.pipe(
      take(1),
      map(principal => {
        const ownerId = principal.uid;
        return { id, data: { ownerId, name } };
      }),
      tap(result => this.update(result).catch(err => console.error(err)))
    ).subscribe();
  }

  update(raspberryPi: RaspberryPi): Promise<void> {
    return this.ngFirestore.collection(`raspberryPis`).doc(raspberryPi.id).set(raspberryPi.data);
  }

  unregister(raspberryPiId: string): Promise<void> {
    return this.ngFirestore.collection(`raspberryPis`).doc(raspberryPiId)
      .update({ ownerId: null });
  }
}
