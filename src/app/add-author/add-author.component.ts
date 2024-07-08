import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsService } from '../author.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-author',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './add-author.component.html',
  styleUrl: './add-author.component.css'
})
export class AddAuthorComponent {
  author: any = {
    au_id: null,
    au_lname: '',
    au_fname: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '00000',
    contract: ''
  };

  constructor(private authorsService: AuthorsService, private router: Router) {}

  saveAuthor(): void {
    this.authorsService.addAuthor(this.author).subscribe(
      () => {
        console.log('Author added successfully');
        this.router.navigate(['/']); // Navigate back to the author list after adding
      },
      error => {
        console.error('Error adding author:', error);
      }
    );
  }
}
