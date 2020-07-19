import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Tournament, TournamentData } from './tournament';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  constructor(private authService: AuthService, private ngFirestore: AngularFirestore) { }

  findAllByOwner(): Observable<Tournament[]> {
    return this.authService.principal.pipe(
      switchMap(principal => {
        const query = ref => ref.where('ownerId', '==', principal.uid);
        const resultSet = this.ngFirestore.collection<TournamentData>('tournaments', query);

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

  create(tournamentData: { name: string, date: Date; }): Promise<DocumentReference> {
    return this.authService.principal
      .pipe(take(1))
      .toPromise()
      .then(principal => {
        const data = {
          ownerId: principal.uid,
          name: tournamentData.name,
          date: tournamentData.date
        };

        return this.ngFirestore.collection('tournaments').add(data);
      });
  }

  update(tournament: Tournament): Promise<void> {
    return this.ngFirestore.collection(`tournaments`).doc(tournament.id).set(tournament.data);
  }

  delete(tournamentId: string): Promise<void> {
    return this.ngFirestore.collection(`tournaments`).doc(tournamentId).delete();
  }
}
