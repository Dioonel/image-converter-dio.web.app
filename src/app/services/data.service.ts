import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_URL = 'https://pacific-journey-56838-0d967bd74bd9.herokuapp.com';
  // API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  convertImage(formData: FormData) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(`${this.API_URL}/convert`, formData, { headers, responseType: 'blob' });
  }
}
