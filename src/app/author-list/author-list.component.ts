import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsService } from '../author.service';
import { Router } from '@angular/router';
import {RouterModule} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [
      CommonModule, 
      RouterModule, 
      MatIconModule, 
      MatTableModule, 
      MatButtonModule, 
      MatToolbarModule
  ],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css'
})

export class AuthorListComponent implements OnInit {
  authors = new MatTableDataSource<any>();  // Use MatTableDataSource for Angular Material Table
  displayedColumns: string[] = [
    'au_id', 'au_lname', 'au_fname', 'phone', 'address', 
    'city', 'state', 'zip', 'contract', 'actions'
  ];

  constructor(private authorsService: AuthorsService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAuthors();
  }

  fetchAuthors(): void {
    this.authorsService.getAuthors()
      .subscribe(
        (data) => {
          this.authors.data = data;
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
    if (confirm('Are you sure you want to delete this author?')) {
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
  
}
