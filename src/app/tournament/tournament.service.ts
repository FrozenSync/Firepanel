import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Tournament, TournamentData } from './tournament';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  private collection: AngularFirestoreCollection<TournamentData>;

  constructor(private ngFirestore: AngularFirestore, authService: AuthService) {
    this.collection = ngFirestore.collection('directors').doc(authService.principal.uid).collection('tournaments');
  }

  findAllByOwner(): Observable<Tournament[]> {
    return this.collection.snapshotChanges().pipe(
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
    return this.collection.add(tournamentData);
  }

  update(tournament: Tournament): Promise<void> {
    return this.collection.doc(tournament.id).set(tournament.data);
  }

  delete(tournamentId: string): Promise<void> {
    return this.collection.doc(tournamentId).delete();
  }
}
