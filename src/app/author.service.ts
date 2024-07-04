// authors.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  private apiUrl = 'http://localhost:3000/api/authors'; 
  constructor(private http: HttpClient) { } //inject HttpClient module

  getAuthors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAuthor(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
