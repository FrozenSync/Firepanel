import { TestBed } from '@angular/core/testing';

import { TournamentService } from './tournament.service';

describe('TournamentServiceService', () => {
  let service: TournamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TournamentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
