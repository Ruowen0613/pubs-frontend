import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';
import { BooksService } from '../book.service';
import { PublishersService } from '../publisher.service';
import { AuthorsService } from '../author.service';
import { Book } from '../book.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule, matDatepickerAnimations } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { Publisher } from '../publisher.interface';
import { Author } from '../author.interface';
import { filter } from 'rxjs';

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
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit {
  book!: Book;
  bookForm!: FormGroup;
  bookId !: string;
  editMode: boolean = false;
  authors: (Author & { fullName: string })[] = [];
  publishers: Publisher[] = [];
  selectedAuthors: string[] = [];
  authorNameToIdMap: { [key: string]: number } = {};

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private booksService: BooksService,
    private authorsService: AuthorsService,
    private publishersService: PublishersService,
    private router: Router
  ) {
    this.bookForm = this.formBuilder.group({
      title_id: [{ value: '', disabled: true }],
      title: ['', Validators.required],
      type: ['', Validators.required],
      pub_id: [''],
      price: [''],
      advance: [''],
      royalty: [''],
      ytd_sales: [''],
      notes: [''],
      pubdate: ['', Validators.required],
      royaltyper: [''],
      authorNames: [[], Validators.required],  // Require at least one author
    })

    this.route.params.subscribe(params => {
      this.bookId = params['id'];
    });
  }

  ngOnInit(): void {
    this.loadBookDetails();
    this.fetchAuthors();
    this.fetchPublishers();
    this.updateFormControlState();
     // Scroll to top on navigation end
     this.router.events
     .pipe(filter((event) => event instanceof NavigationEnd))
     .subscribe(() => {
       window.scrollTo(0, 0);
     });
  }

  loadBookDetails(): void {
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
            pubdate: this.book.pubdate,
            royaltyper: this.book.royaltyper,
            authorNames: this.book.authorNames
          });
          this.selectedAuthors = this.book.authorNames;
        },
        error => {
          console.error('Error fetching author details:', error);
        }
      );
  }

  fetchAuthors(): void {
    this.authorsService.getAuthors().subscribe(
      (data) => {
        this.authors = data.map((author: Author) => ({
          ...author,
          fullName: `${author.au_fname} ${author.au_lname}`
        }));
        // Create a map for quick lookup
        this.authorNameToIdMap = this.authors.reduce((map, author) => {
          map[author.fullName || ''] = author.au_id;
          return map;
        }, {} as { [key: string]: number });
      },
      (error) => {
        console.error('Error fetching authors:', error);
      }
    );
  }

  fetchPublishers(): void {
    this.publishersService.getPublishers().subscribe(
      (data: Publisher[]) => {
        this.publishers = data;
      },
      (error) => {
        console.error('Error fetching publishers:', error);
      }
    )
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    this.updateFormControlState();
  }

  // Update form controls' enabled/disabled state based on edit mode
  updateFormControlState(): void {
    if (this.editMode) {
      this.bookForm.get('title')?.enable();
      this.bookForm.get('type')?.enable();
      this.bookForm.get('price')?.enable();
      this.bookForm.get('authorNames')?.enable();
      this.bookForm.get('royaltyper')?.enable();
      this.bookForm.get('pub_id')?.enable();
      this.bookForm.get('advance')?.enable();
      this.bookForm.get('royalty')?.enable();
      this.bookForm.get('ytd_sales')?.enable();
      this.bookForm.get('notes')?.enable();
      this.bookForm.get('pubdate')?.enable();
    } else {
      this.bookForm.get('title')?.disable();
      this.bookForm.get('type')?.disable();
      this.bookForm.get('price')?.disable();
      this.bookForm.get('authorNames')?.disable();
      this.bookForm.get('royaltyper')?.disable();
      this.bookForm.get('pub_id')?.disable();
      this.bookForm.get('advance')?.disable();
      this.bookForm.get('royalty')?.disable();
      this.bookForm.get('ytd_sales')?.disable();
      this.bookForm.get('notes')?.disable();
      this.bookForm.get('pubdate')?.disable();
    }
  }

  // Called whenever the selection changes
  onSelectionChange(selectedValues: string[]) {
    this.selectedAuthors = this.updateSelectionOrder(selectedValues, this.selectedAuthors);
  }

  // Maintain selection order
  updateSelectionOrder(newSelections: string[], currentSelections: string[]): string[] {
    // Merge new selections, maintaining the order
    const selectedSet = new Set(currentSelections);

    newSelections.forEach((selection) => {
      if (!selectedSet.has(selection)) {
        selectedSet.add(selection);
        currentSelections.push(selection);
      }
    });

    this.selectedAuthors = currentSelections.filter((selection) => newSelections.includes(selection));
    this.bookForm.get('authorNames')?.setValue(this.selectedAuthors);
    return this.selectedAuthors;
  }

  saveBook(): void {
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
