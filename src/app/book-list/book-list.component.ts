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
    MatPaginatorModule
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit{
  books = new MatTableDataSource<Book>();
  displayedColumns : string[] = [
    'title_id', 'title', 'type', 'pub_id', 'price', 
    'royalty', 'ytd_sales', 'notes', 'pubdate', 'actions'
  ];
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private booksSevice : BooksService, private router : Router) {}

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.booksSevice.getBooks()
    .subscribe(
      (data : Book[]) => {
        this.books.data = data;
        if (this.paginator) {
          this.books.paginator = this.paginator;
        }
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    )
  }

  editBook(title_id : number) {
    this.router.navigate(['/edit-book', title_id]);
  }

  goToAddBook(): void{
    this.router.navigate(['/add-book']);
  }

  deleteBook(title_id : string) {
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
}
