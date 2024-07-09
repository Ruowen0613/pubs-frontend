import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorsService } from '../author.service';
import {RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  authorForm: FormGroup;
  authorId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authorService: AuthorsService
  ) {
    // Initialize form here in the constructor
    this.authorForm = this.formBuilder.group({
      au_id: [{ value: '', disabled: true }],
      au_lname: ['', Validators.required],
      au_fname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.maxLength(12)]],
      address: [''],
      city: [''],
      state: ['', Validators.maxLength(2)],
      zip: ['', [Validators.pattern('[0-9]{5}')]],
      contract: ['', Validators.required]
    });

    // Assuming you retrieve authorId from route parameters
    this.route.params.subscribe(params => {
      this.authorId = params['id'];
    });
  }
  ngOnInit(): void {
    // Optionally, you can load author details using authorId from a service
    this.loadAuthorDetails();
  }

  loadAuthorDetails(): void {
    // Example: Fetch author details using authorId from your service
    this.authorService.getAuthorByID(this.authorId)
      .subscribe(
        (author: any) => {
          this.author = author;
          // Patch form values with fetched author details
          this.authorForm.patchValue({
            au_id: this.author.au_id,
            au_lname: this.author.au_lname,
            au_fname: this.author.au_fname,
            phone: this.author.phone,
            address: this.author.address,
            city: this.author.city,
            state: this.author.state,
            zip: this.author.zip,
            contract: this.author.contract
          });
        },
        error => {
          console.error('Error fetching author details:', error);
          // Handle error loading author details
        }
      );
  }

  saveAuthor(): void {
    if (this.authorForm.valid) {
      const authorData = this.authorForm.value;
      // Pass both authorId and authorData to updateAuthor function
      this.authorService.updateAuthor(this.authorId, authorData)
        .subscribe(
          () => {
            alert('Author updated successfully');
            this.router.navigate(['/authors']);
          },
          error => {
            console.error('Error updating author:', error);
            alert('Failed to update author');
          }
        );
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}