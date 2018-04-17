import { TestBed, inject } from '@angular/core/testing';

import { CoauthorNetworkDatabaseService } from './coauthor-network-database.service';

describe('CoauthorNetworkDatabaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoauthorNetworkDatabaseService]
    });
  });

  it('should be created', inject([CoauthorNetworkDatabaseService], (service: CoauthorNetworkDatabaseService) => {
    expect(service).toBeTruthy();
  }));
});
