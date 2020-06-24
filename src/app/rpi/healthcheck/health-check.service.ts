import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ConsulService } from './consul-node';


@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {

  private healthCheckUrl = environment.consulUrl + '/health/node/';

  constructor(private http: HttpClient) {}

  getHealth(nodeId: string): Observable<ConsulService[]> {
    const url = this.healthCheckUrl + nodeId;

    return this.http
      .get<ConsulService[]>(url, { observe: 'response', responseType: 'json' }).pipe(
        map(res => res.body)
      );
  }
}
