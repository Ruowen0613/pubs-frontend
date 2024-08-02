import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Book } from '../book.interface';
import { BooksService } from '../book.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatPaginator,
    MatTableModule,
    RouterModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  books = new MatTableDataSource<Book>();
  searchQuery: string = '';
  // displayedColumns : string[] = [
  //   'title_id', 'title', 'type', 'pub_id', 'price', 
  //   'royalty', 'ytd_sales', 'notes', 'pubdate', 'actions'
  // ];
  displayedColumns: string[] = [
    'title', 'type', 'price', 'ytd_sales', 'notes', 'pubdate', 'actions'
  ];

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort; // Add MatSort for sorting

  constructor(private booksSevice: BooksService, private router: Router) { }

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.booksSevice.getBooks()
      .subscribe(
        (data: Book[]) => {
          this.books.data = data;
          this.applyFilter(); // Apply current filter after fetching books
          
          //define pagination feature for MatTableDataSource
          if (this.paginator) {
            this.books.paginator = this.paginator;
          }

          //define sorting feature for MatTableDataSource
          if (this.sort) {
            this.books.sort = this.sort;
          }
        },
        (error) => {
          console.error('Error fetching books:', error);
        }
      )
  }

  editBook(title_id: number) {
    this.router.navigate(['/edit-book', title_id]);
  }

  goToAddBook(): void {
    this.router.navigate(['/add-book']);
  }

  deleteBook(title_id: string) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.booksSevice.deleteBook(title_id).subscribe(
        () => {
          this.books.data = this.books.data.filter((book: any) => book.title_id !== title_id);
          alert('Book deleted successfully');
        },
        error => {
          console.error('Error deleting book:', error);
          alert(`Failed to delete book: ${error.message || error}`);
        }
      );
    }
  }

  applyFilter(): void {
    //define filter feature for MatTableDataSource
    this.books.filter = this.searchQuery.trim().toLowerCase();
    if (this.books.paginator) {
      this.books.paginator.firstPage();
    }
  }

  performSearch(): void {
    this.fetchBooks(); // Perform search by fetching books again
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.books.filter = ''; // Clear the filter
  }
}
