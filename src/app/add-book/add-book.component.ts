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
import { Book } from '../book.interface';

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
  authors: (Author & { fullName: string })[] = [];
  publishers: Publisher[] = [];
  selectedAuthors: string[] = []; // Array to hold selected authors
  newRoyalTypers: number[] = [];

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

      authorNames: [[], Validators.required],  // Require at least one author
    });
  }
  ngOnInit(): void {
    this.fetchAuthors();
    this.fetchPublishers();
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
    this.addBookForm.get('authorNames')?.setValue(this.selectedAuthors);
    return this.selectedAuthors;
  }

  updateRoyalty(i: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.newRoyalTypers[i] = target.valueAsNumber;
      console.log(this.newRoyalTypers[i]);
    }
  }

  // Method to get updated book data including royalties
  getUpdatedBookData(): Book {
    const bookData = this.addBookForm.value as Book;
    return {
      ...bookData,
      royalTypers: this.newRoyalTypers
    };
  }

  hasError(index: number): boolean {
    // Check if the value is null or invalid based on your criteria
    console.log("errpr")
    return isNaN(this.newRoyalTypers[index]);
  }
  
  saveBook(): void {
    if (this.addBookForm.valid) {
      const updatedBook = this.getUpdatedBookData();
      console.log(updatedBook);
      this.booksService.addBook(updatedBook)
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
