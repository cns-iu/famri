import { TestBed, inject } from '@angular/core/testing';

import { ScienceMapDatabaseService } from './science-map-database.service';

describe('ScienceMapDatabaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScienceMapDatabaseService]
    });
  });

  it('should be created', inject([ScienceMapDatabaseService], (service: ScienceMapDatabaseService) => {
    expect(service).toBeTruthy();
  }));
});
