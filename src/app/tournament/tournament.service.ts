import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Tournament, TournamentData } from './tournament';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  constructor(private authService: AuthService, private ngFirestore: AngularFirestore) { }

  findAllByOwner(): Observable<Tournament[]> {
    const ownerId = this.authService.principal.uid;
    const query = ref => ref.where('ownerId', '==', ownerId);
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
  }

  create(tournamentData: TournamentData): Promise<DocumentReference> {
    tournamentData.ownerId = this.authService.principal.uid;
    return this.ngFirestore.collection('tournaments').add(tournamentData);
  }

  update(tournament: Tournament): Promise<void> {
    return this.ngFirestore.collection(`tournaments`).doc(tournament.id).set(tournament.data);
  }

  delete(tournamentId: string): Promise<void> {
    return this.ngFirestore.collection(`tournaments`).doc(tournamentId).delete();
  }
}
