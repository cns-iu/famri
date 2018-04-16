import { TestBed, inject } from '@angular/core/testing';

import { GeomapDatabaseService } from './geomap-database.service';

describe('GeomapDatabaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeomapDatabaseService]
    });
  });

  it('should be created', inject([GeomapDatabaseService], (service: GeomapDatabaseService) => {
    expect(service).toBeTruthy();
  }));
});
