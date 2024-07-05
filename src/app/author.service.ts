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

  //get all authors
  getAuthors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  //get author by id
  getAuthorByID(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  //update author by id
  updateAuthor(id: string, author: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, author)
  }

  //delete author by id
  deleteAuthor(au_id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${au_id}`);
  }
}
