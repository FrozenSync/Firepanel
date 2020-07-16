import { TestBed } from '@angular/core/testing';

import { RaspberryPiService } from './raspberry-pi.service';

describe('RaspberryPiService', () => {
  let service: RaspberryPiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaspberryPiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
