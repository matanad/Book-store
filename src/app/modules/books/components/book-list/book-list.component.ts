import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../../core/services/book.service';
import { CartService } from '../../../../core/services/cart.service';
import { Book, IBooksFilter } from '../../../../core/models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: false,
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  maxPages: number = 1;
  filterBy: IBooksFilter = { pageIdx: 1 };
  isLoading: boolean = true;

  constructor(
    private booksService: BookService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.booksService.$activeFilter.subscribe((filter) => {
      this.filterBy = { ...filter, ...this.filterBy };
    });
    this.booksService.query(this.filterBy);
    this.booksService.$books.subscribe((books) => {
      this.maxPages = this.booksService.getMaxPages();
      this.books = books;
      this.isLoading = false;
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
    this.isLoading = true;
    this.booksService.query(filter);
  }

  addToCart(event: MouseEvent, bookId: string) {
    event.stopPropagation();
    this.cartService.addBook(bookId);
  }
}
