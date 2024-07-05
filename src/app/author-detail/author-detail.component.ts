
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorsService } from '../author.service';
import {RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [RouterModule, CommonModule],
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
}
