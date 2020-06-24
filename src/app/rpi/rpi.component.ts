import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, throwError } from 'rxjs';

import { HealthCheckService } from './healthcheck/health-check.service';
import { ConsulService } from './healthcheck/consul-node';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-rpi',
  templateUrl: './rpi.component.html',
  styleUrls: ['./rpi.component.css']
})
export class RpiComponent implements OnInit {

  userId: string;

  id: string;
  name: string;

  pis: Observable<any[]>;

  services: Observable<ConsulService[]>;
  consulError: string | null = null;

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private healthService: HealthCheckService) {
    this.auth.user.subscribe(user => {
      this.userId = user.uid;
      this.pis = firestore.collection('raspberryPis', ref => ref.where('ownerId', '==', this.userId)).valueChanges();
    });

    this.services = this.healthService.getHealth('pop-os').pipe(
      catchError(err => {
        this.consulError = 'The health check service seems to be down.';
        return throwError(err);
      })
    );
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.id);
    const doc = this.firestore.collection('raspberryPis').doc(this.id);
    doc.update({
      ownerId: this.userId,
      name: this.name
    }).catch(err => console.log(err));
  }
}
