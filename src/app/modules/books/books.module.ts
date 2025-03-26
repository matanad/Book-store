import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BooksRoutingModule } from './books-routing.module';
import { BooksComponent } from './books.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { ModalComponent } from './components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BookLoaderComponent } from './components/book-loader/book-loader.component';

@NgModule({
  declarations: [
    BooksComponent,
    BookListComponent,
    BookDetailsComponent,
    ModalComponent,
    BookLoaderComponent,
  ],
  imports: [
    CommonModule,
    BooksRoutingModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class BooksModule {}
