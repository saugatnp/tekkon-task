import { TestBed } from '@angular/core/testing';

import { Localstorage } from './localstorage';

describe('Localstorage', () => {
  let service: Localstorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Localstorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
