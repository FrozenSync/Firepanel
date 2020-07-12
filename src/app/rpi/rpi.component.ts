import { Component, OnInit } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { RaspberryPi, RaspberryPiService } from './raspberry-pi.service';
import { HealthCheckService } from './healthcheck/health-check.service';
import { ConsulService } from './healthcheck/consul-node';

@Component({
  selector: 'app-rpi',
  templateUrl: './rpi.component.html',
  styleUrls: ['./rpi.component.css']
})
export class RpiComponent implements OnInit {

  userId: string;

  id: string;
  name: string;

  pis: Observable<RaspberryPi[]>;

  services: Observable<ConsulService[]>;
  consulError: string | null = null;

  constructor(private authService: AuthService,
              private raspberryPiService: RaspberryPiService,
              private healthService: HealthCheckService) {}

  ngOnInit(): void {
    this.authService.principal.subscribe(user => this.userId = user.uid);
    this.pis = this.raspberryPiService.findAllByOwner();

    this.services = this.healthService.getHealth('pop-os').pipe(
      catchError(err => {
        this.consulError = 'The health check service seems to be down.';
        return throwError(err);
      })
    );
  }

  onSubmit() {
    const result: RaspberryPi = {
      id: this.id,
      ownerId: this.userId,
      name: this.name
    };
    this.raspberryPiService.save(result);
  }
}
