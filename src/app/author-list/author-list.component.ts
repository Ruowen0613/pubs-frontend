import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsService } from '../author.service';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css'
})

export class AuthorListComponent implements OnInit {
  authors: any[] = [];

  constructor(private authorsService: AuthorsService) {}

  ngOnInit(): void {
    this.fetchAuthors();
  }

  fetchAuthors(): void {
    this.authorsService.getAuthors()
      .subscribe(
        (data) => {
          this.authors = data;
        },
        (error) => {
          console.error('Error fetching authors:', error);
          // Handle error
        }
      );
  }

  openAuthorDetails(authorId: string): void {
    const url = `https://yourdomain.com/author-details/${authorId}`;
    window.open(url, '_blank');
  }
}
