import { firestore } from 'firebase';
import Timestamp = firestore.Timestamp;

export interface Tournament {
  id: string;
  data: TournamentData;
}

export interface TournamentData {
  ownerId: string;
  name: string;
  date: Timestamp;
}
