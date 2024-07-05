// src/app/routes.ts

import { Routes } from '@angular/router';
import { AuthorListComponent } from './author-list/author-list.component';
import { AuthorDetailComponent } from './author-detail/author-detail.component';

const routeConfig: Routes = [
  { path: '', redirectTo: '/authors', pathMatch: 'full' },
  { path: 'authors', component: AuthorListComponent },
  //{ path: 'authors/:id', component: AuthorDetailComponent },
  { path: 'edit-author/:id', component: AuthorDetailComponent }
];

export default routeConfig;
