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
    this.booksService.$activeFilter.subscribe((res) => (this.filterBy = res));
  }

  onChangePage(page: number, nextPrev: boolean = false) {
    const filter = { ...this.filterBy };
    if (!this.filterBy.pageIdx || !filter.pageIdx) return;
    if (nextPrev)
      if (filter.pageIdx + page < 1 || filter.pageIdx + page >= this.maxPages)
        return;
      else filter.pageIdx += page;
    else filter.pageIdx = page;
    this.booksService.query(filter);
  }
}
