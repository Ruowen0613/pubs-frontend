// books.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private apiUrl = 'http://localhost:3000/api/books'; 
  constructor(private http: HttpClient) { } //inject HttpClient module

  //get all books
  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  //get book by id
  getBookByID(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  //update book by id
  updateBook(id: string, book: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, book)
  }

  //add new book
  addBook(book: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, book);
  }

  //delete book by id
  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
