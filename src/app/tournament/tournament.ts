import { firestore } from 'firebase';
import Timestamp = firestore.Timestamp;

export interface Tournament {
  id: string;
  data: TournamentData;
}

export interface TournamentData {
  name: string;
  date: Timestamp;
  assignedRaspberryPis: [{
    id: string;
    role: Role;
  }];
}

export type Role = 'master' | 'slave';
