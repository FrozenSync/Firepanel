import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export interface RaspberryPi {
  id: string;
  data: RaspberryPiData;
}

export interface RaspberryPiData {
  ownerId: string;
  name: string;
  healthCheck?: Health;
}

export interface Health {
  latestPing: Timestamp;
}
