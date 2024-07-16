// src/app/routes.ts

import { Routes } from '@angular/router';
import { AuthorListComponent } from './author-list/author-list.component';
import { AuthorDetailComponent } from './author-detail/author-detail.component';
import { AddAuthorComponent } from './add-author/add-author.component';
import { HomeComponent } from './home/home.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { AddBookComponent } from './add-book/add-book.component';

const routeConfig: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'authors', component: AuthorListComponent },
  { path: 'books', component: BookListComponent },
  { path: 'edit-author/:id', component: AuthorDetailComponent },
  { path: 'add-author', component: AddAuthorComponent },
  { path: 'edit-book/:id', component: BookDetailComponent },
  { path: 'add-book', component: AddBookComponent}
];

export default routeConfig;
