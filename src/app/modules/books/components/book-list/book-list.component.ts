import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../../core/services/book.service';
import { CartService } from '../../../../core/services/cart.service';
import { Book, IBooksFilter } from '../../../../core/models/book.model';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs';

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
  isAdmin: boolean = false;
  bookToEdit: Book = {} as Book;

  constructor(
    private booksService: BookService,
    private cartService: CartService,
    private route: ActivatedRoute
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

    const fullPath = this.route.snapshot.pathFromRoot
      .map((r) => r.routeConfig?.path)
      .filter((path) => path)
      .join('/');

    if (fullPath.includes('admin')) this.isAdmin = true;
  }

  editBook(event: MouseEvent, book: Book) {
    event.stopPropagation();
    this.bookToEdit = book;
  }

  saveBook(event: any) {
    if (this.isAdmin)
      this.booksService
        .save(event)
        .pipe(take(1))
        .subscribe({
          next: (book) => {
            this.booksService.query(this.filterBy);
            this.bookToEdit = {} as Book;
          },
          error: (err) => console.error(err),
        });
  }

  onCloseModal() {
    this.bookToEdit = {} as Book;
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

  deleteBook(event: MouseEvent, bookId: string) {
    event.stopPropagation();
    console.log(this.isAdmin);

    if (this.isAdmin)
      this.booksService
        .remove(bookId)
        .pipe(take(1))
        .subscribe({
          next: () => this.booksService.query(this.filterBy),
          error: (err) => console.error(err),
        });
  }
}
