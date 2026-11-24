import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';

declare function describe(description: string, specDefinitions: () => void): void;
declare function beforeEach(action: () => void): void;
declare function it(description: string, testFunction: () => void): void;
declare function expect(actual: unknown): { toBeTruthy(): void };

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
