import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Package } from './models/package.model';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private baseUrl = 'http://localhost:3000/packages';

  constructor(private http: HttpClient) {}

  getPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.baseUrl}`);
  }

  getPackageDependencies(id: string): Observable<string[]> {
    const encodedId = encodeURIComponent(id);
    return this.http.get<string[]>(`${this.baseUrl}/${encodedId}/dependencies`);
  }
}
