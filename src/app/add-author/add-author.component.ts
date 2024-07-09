import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorsService } from '../author.service';

@Component({
  selector: 'app-add-author',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.css']
})
export class AddAuthorComponent {
  addAuthorForm: FormGroup;

  constructor(private fb: FormBuilder, private authorsService: AuthorsService, private router: Router) {
    this.addAuthorForm = this.fb.group({
      au_id: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{2}-\d{4}$/)]],
      au_lname: ['', Validators.required],
      au_fname: ['', Validators.required],
      phone: ['UNKNOWN', [Validators.required, Validators.maxLength(12)]],
      address: [''],
      city: [''],
      state: ['', Validators.maxLength(2)],
      zip: ['', Validators.pattern(/^\d{5}$/)],
      contract: [false, Validators.required]
    });
  }
  saveAuthor(): void {
    if (this.addAuthorForm.valid) {
      const authorData = this.addAuthorForm.value;
      if (!authorData.zip) {
        authorData.zip = null;  // Ensure zip is null if not provided
      }

      this.authorsService.addAuthor(authorData)
        .subscribe(
          () => {
            alert('Author added successfully');
            this.router.navigate(['/authors']);
          },
          error => {
            console.error('Error adding author:', error);
            alert(`Failed to add author: ${error.message || error}`);
          }
        );
    } else {
      alert('Please fill out the form correctly.');
    }
  }
  
}
