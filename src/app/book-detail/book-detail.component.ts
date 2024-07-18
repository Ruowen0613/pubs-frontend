import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BooksService } from '../book.service';
import { Book } from '../book.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
  ],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit{
  book!: Book;
  bookForm!: FormGroup;
  bookId !: string;
  editMode: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private booksService: BooksService,
    private router: Router
  ) {
    this.bookForm = this.formBuilder.group({
      title_id: [{ value: '', disabled: true }],
      title: ['', Validators.required],
      type: ['', Validators.required],
      pub_id: [{ value: '', disabled: true }],
      price: [''],
      advance: [''],
      royalty: [''],
      ytd_sales: [''],
      notes: [''],
      pubdate: ['', Validators.required]
    })

    this.route.params.subscribe(params => {
      this.bookId = params['id'];
    });
  }

  ngOnInit(): void {
    this.loadBookDetails();
  }

  loadBookDetails(): void{
    this.booksService.getBookByID(this.bookId)
    .subscribe(
      (book: Book) => {
        this.book = book;
        this.bookForm.patchValue({
          title_id: this.book.title_id,
          title: this.book.title,
          type: this.book.type,
          pub_id: this.book.pub_id,
          price: this.book.price,
          advance: this.book.advance,
          royalty: this.book.royalty,
          ytd_sales: this.book.ytd_sales,
          notes: this.book.notes,
          pubdate: this.book.pubdate
        });
      },
      error => {
        console.error('Error fetching author details:', error);
      }
    );
  }

  toggleEditMode(): void{
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.bookForm.patchValue(this.book);
    }
  }

  saveBook(): void{
    if (this.bookForm.valid) {
      this.booksService.updateBook(this.bookId, this.bookForm.value)
      .subscribe(
        () => {
          alert('Book updated successfully');
          this.router.navigate(['/books']);
        },
        error => {
          console.error('Error updating book:', error);
          alert('Failed to update book');
        }
      )
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
