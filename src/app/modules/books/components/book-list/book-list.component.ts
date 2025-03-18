import { Component, OnInit } from '@angular/core';
import {
  Book,
  BookService,
  IFilter,
} from '../../../../core/services/book.service';

@Component({
  selector: 'app-book-list',
  standalone: false,
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  maxPages: number = 1;
  filterBy: IFilter = { pageIdx: 1 };

  constructor(private booksService: BookService) {}

  ngOnInit(): void {
    this.booksService.query(this.filterBy);
    this.booksService.$books.subscribe((books) => {
      this.maxPages = this.booksService.getMaxPages();
      this.books = books;
    });
  }

  onChangePage(page: number) {
    this.filterBy.pageIdx = page;
    this.booksService.query(this.filterBy);
  }
}
