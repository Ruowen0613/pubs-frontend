// publisher.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publisher } from './publisher.interface';

@Injectable({
  providedIn: 'root'
})
export class PublishersService {

  private apiUrl = 'http://localhost:3000/api/publishers'; 
  constructor(private http: HttpClient) { } //inject HttpClient module

  //get all publishers
  getPublishers(): Observable<any[]> {
    return this.http.get<Publisher[]>(this.apiUrl);
  }

//   //get author by id
//   getAuthorByID(id: string): Observable<any> {
//     return this.http.get(`${this.apiUrl}/${id}`);
//   }

//   //update author by id
//   updateAuthor(id: string, author: Author): Observable<any> {
//     return this.http.put(`${this.apiUrl}/${id}`, author)
//   }

//   //add new author
//   addAuthor(author: Author): Observable<any> {
//     return this.http.post(`${this.apiUrl}`, author);
//   }

//   //delete author by id
//   deleteAuthor(au_id: string): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${au_id}`);
//   }
}
