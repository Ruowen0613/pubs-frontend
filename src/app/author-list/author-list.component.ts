import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsService } from '../author.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Author } from '../author.interface';
import { FormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [
      CommonModule, 
      RouterModule, 
      MatIconModule, 
      MatTableModule, 
      MatButtonModule, 
      MatToolbarModule,
      MatPaginatorModule,
      FormsModule,
      MatSortModule
  ],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css'
})

export class AuthorListComponent implements OnInit {
  authors = new MatTableDataSource<Author>();  // Use MatTableDataSource for Angular Material Table
  displayedColumns: string[] = [
    'fullName', 'phone', 'address', 
    'city', 'state', 'zip', 'contract', 'actions'
  ];
  searchQuery: string = '';

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  
  constructor(private authorsService: AuthorsService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAuthors();
  }

  fetchAuthors(): void {
    this.authorsService.getAuthors()
      .subscribe(
        (data: Author[]) => {
          this.authors.data = data.map((author: Author) => ({
            ...author,
            fullName: `${author.au_fname} ${author.au_lname}`
          }));
          
          if (this.paginator) {
            this.authors.paginator = this.paginator;
          }
          if (this.sort) {
            this.authors.sort = this.sort;
          }
        },
        (error) => {
          console.error('Error fetching authors:', error);
          // Handle error
        }
      );
  }

  editAuthor(au_id: number): void {
    this.router.navigate(['/edit-author', au_id]);
  }

  goToAddAuthor(): void {
    this.router.navigate(['/add-author']);
  }

  deleteAuthor(au_id: string): void {
    if (confirm('Are you sure you want to delete this author? This will also delete all the books by this author.')) {
      this.authorsService.deleteAuthor(au_id).subscribe(
        () => {
          this.authors.data = this.authors.data.filter((author: any) => author.au_id !== au_id);
          alert('Author deleted successfully');
        },
        error => {
          console.error('Error deleting author:', error);
          alert(`Failed to delete author: ${error.message || error}`);
        }
      );
    }
  }

  applyFilter(): void {
    //define filter feature for MatTableDataSource
    this.authors.filter = this.searchQuery.trim().toLowerCase();
    if (this.authors.paginator) {
      this.authors.paginator.firstPage();
    }
  }

  performSearch(): void {
    this.fetchAuthors(); // Perform search by fetching books again
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.authors.filter = ''; // Clear the filter
  }
  
}
