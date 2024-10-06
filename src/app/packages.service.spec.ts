import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PackageService } from './packages.service';

describe('PackageService', () => {
  let service: PackageService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:3000/packages';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PackageService],
    });

    service = TestBed.inject(PackageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch packages', () => {
    const mockPackages = [
      { id: 'rxjs', weeklyDownloads: 600000, dependencyCount: 2 },
      { id: '@angular/core', weeklyDownloads: 1200000, dependencyCount: 5 },
    ];

    service.getPackages().subscribe((packages) => {
      expect(packages.length).toBe(2);
      expect(packages).toEqual(mockPackages);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPackages);
  });

  it('should fetch package dependencies', () => {
    const mockDependencies = ['@angular/common', '@angular/compiler'];
    const packageId = '@angular/core';

    service.getPackageDependencies(packageId).subscribe((dependencies) => {
      expect(dependencies).toEqual(mockDependencies);
    });

    const encodedId = encodeURIComponent(packageId);
    const req = httpMock.expectOne(`${baseUrl}/${encodedId}/dependencies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDependencies);
  });
});
