import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Part, InstallationGuide, CompatibilityInfo } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class PartsService {
  private apiUrl = 'http://localhost:3000/api/parts';

  constructor(private http: HttpClient) {}

  getAllParts(category?: string, search?: string): Observable<Part[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    
    if (category) params.push(`category=${category}`);
    if (search) params.push(`search=${search}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return this.http.get<Part[]>(url);
  }

  getPartByNumber(partNumber: string): Observable<Part> {
    return this.http.get<Part>(`${this.apiUrl}/${partNumber}`);
  }

  getPartCompatibility(partNumber: string): Observable<CompatibilityInfo[]> {
    return this.http.get<CompatibilityInfo[]>(`${this.apiUrl}/${partNumber}/compatibility`);
  }

  getInstallationGuide(partNumber: string): Observable<InstallationGuide> {
    return this.http.get<InstallationGuide>(`${this.apiUrl}/${partNumber}/installation`);
  }

  checkCompatibility(partNumber: string, modelNumber: string): Observable<{ compatible: boolean; partNumber: string; modelNumber: string }> {
    return this.http.post<{ compatible: boolean; partNumber: string; modelNumber: string }>(`${this.apiUrl}/check-compatibility`, {
      partNumber,
      modelNumber
    });
  }
}
