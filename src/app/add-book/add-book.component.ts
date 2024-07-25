import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService } from '../book.service';
import { AuthorsService } from '../author.service';
import { PublishersService } from '../publisher.service';
import { Author } from '../author.interface';
import { Publisher } from '../publisher.interface';
import { Observable, map, startWith } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule, matDatepickerAnimations } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit{
  addBookForm: FormGroup;
  authors: Author[] = [];
  publishers: Publisher[] = [];
  //filteredAuthors: Observable<Author[]> | undefined;
  authorNotFound = false;
  dropdownInteracted = false;
  selectedAuthors: Author[] = []; // Array to hold selected authors

  @ViewChild(MatAutocompleteTrigger) autoTrigger: MatAutocompleteTrigger | undefined;

  constructor(
    private fb: FormBuilder, 
    private booksService: BooksService, 
    private router: Router,
    private authorsService: AuthorsService,
    private publishersService: PublishersService
  ) {
      this.addBookForm = this.fb.group({
      title_id: ['', [Validators.required, Validators.maxLength(6)]],
      title: ['', Validators.required],
      type: ['UNDECIDED', Validators.required],
      pub_id: ['', Validators.maxLength(4)],
      price: [''],
      advance: [''],
      royalty: [''],
      ytd_sales: [''],
      notes: [''],
      pubdate: [new Date().toISOString().split('T')[0], Validators.required], // Default to current date
      royaltyper: [''],
      authorNames: [[], Validators.required],  // Require at least one author
    });
  }
  ngOnInit(): void {
    this.fetchAuthors();
    this.fetchPublishers();
    // this.filteredAuthors = this.addBookForm.get('authorName')?.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterAuthors(value))
    // );
  }


  fetchAuthors(): void {
    this.authorsService.getAuthors().subscribe(
      (data) => {
        this.authors = data.map((author: Author) => ({
          ...author,
          fullName: `${author.au_fname} ${author.au_lname}`
        }));
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

  get authorsControl() {
    return this.addBookForm.get('authors') as FormArray;
  }
  
  onAuthorSelectionChange(event: any): void {
    const selectedIds = event.value;
    this.selectedAuthors = this.authors.filter(author => selectedIds.includes(author.au_id));
  }
  
  /*onAuthorSelected(event: any): void {
    //find returns matched object
    //const selectedAuthor = this.authors.find(author => author.fullName === event.option.value);
  }*/

    
  private _filterAuthors(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.authors.filter(author => author.fullName?.toLowerCase().includes(filterValue));
  }

  onDropdownInteraction() {
    this.dropdownInteracted = true;
    setTimeout(() => this.dropdownInteracted = false, 100); // Reset flag after a short delay
  }

  onDropdownFocus(): void {
    this.addBookForm.get('authorName')?.updateValueAndValidity();
  }

  //check whether the input authorname matches any of the full name in authors list
  onAuthorInput() {
    const authorName = this.addBookForm.get('authorName')?.value;
    //some returns a boolean
    const exists = this.authors.some(author => author.fullName!.toLowerCase() === authorName.toLowerCase());
    this.authorNotFound = authorName && !exists && !this.dropdownInteracted;
  }

  navigateToAddAuthor() {
    this.router.navigate(['/add-author'], { queryParams: { redirectTo: 'add-book' } });
  }

  saveBook(): void {
    if (this.addBookForm.valid) {
      const bookData = this.addBookForm.value;

      this.booksService.addBook(bookData)
        .subscribe(
          () => {
            alert('Book added successfully');
            this.router.navigate(['/books']);
          },
          error => {
            console.error('Error adding book:', error);
            alert(`Failed to add book: ${error.message || error}`);
          }
        );
    } else {
      alert('Please fill out the form correctly.');
    }
  }
  
}
