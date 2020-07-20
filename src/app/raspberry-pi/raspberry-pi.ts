export interface RaspberryPi {
  id: string;
  data: RaspberryPiData;
}

export interface RaspberryPiData {
  ownerId: string;
  name: string;
}
