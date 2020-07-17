import { TestBed } from '@angular/core/testing';

import { MumblerService } from './mumbler.service';

describe('CommunicationService', () => {
  let service: MumblerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MumblerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
