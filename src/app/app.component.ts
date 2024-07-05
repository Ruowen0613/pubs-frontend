import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthorListComponent } from './author-list/author-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'db-app';
}
