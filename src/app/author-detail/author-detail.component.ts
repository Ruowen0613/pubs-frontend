
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorsService } from '../author.service';
import {RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './author-detail.component.html',
  styleUrl: './author-detail.component.css'
})

export class AuthorDetailComponent implements OnInit {
  author: any;

  constructor(
    private route: ActivatedRoute,
    private authorService: AuthorsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id)
    this.authorService.getAuthorByID(id!).subscribe((data: any) => {

      this.author = data;
      //this.AuthorId=String(this.author.au_id)

    });
  }

  saveAuthor(): void {
    this.authorService.updateAuthor(this.author.au_id, this.author).subscribe(() => {
      alert('Author updated successfully');
      window.close(); // Close the window after saving
    });
  }
}
