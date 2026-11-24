import { TestBed } from '@angular/core/testing';
import { AddressService } from './address.service';

describe('AddressService', () => {
  let service: AddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Address);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
