import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../../core/services/book.service';
import { CartService } from '../../../../core/services/cart.service';
import { Book, IBooksFilter } from '../../../../core/models/book.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';

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
  isEditMode: boolean = false;
  isLogedInUser: boolean = false;

  constructor(
    private booksService: BookService,
    private cartService: CartService,
    private acticatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.booksService.$isLoading.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
    this.booksService.$activeFilter.subscribe((filter) => {
      this.filterBy = { ...filter, ...this.filterBy };
    });
    this.booksService.query(this.filterBy);
    this.booksService.$books.subscribe((books) => {
      this.maxPages = this.booksService.getMaxPages();
      this.books = books;
    });
    this.booksService.$activeFilter.subscribe((res) => (this.filterBy = res));

    const fullPath = this.acticatedRoute.snapshot.pathFromRoot
      .map((r) => r.routeConfig?.path)
      .filter((path) => path)
      .join('/');

    if (fullPath.includes('admin')) this.isAdmin = true;

    this.userService.$isAuthenticated.subscribe(
      (isAuth) => (this.isLogedInUser = isAuth)
    );
  }

  onAddBook() {
    if (!this.isLogedInUser) return;
    this.isEditMode = false;
    this.bookToEdit = new Book('', '', '', '', '', '', 1);
  }

  getPages() {
    return Array.from({ length: this.maxPages }, (_, i) => i + 1);
  }

  getLoadingBooks() {
    return Array.from({ length: 10 }, (_, i) => i + 1);
  }

  editBook(event: MouseEvent, book: Book) {
    event.stopPropagation();
    this.isEditMode = true;
    this.bookToEdit = book;
  }

  saveBook(event: any) {
    if (this._isBookHasEmptyFields(event)) return;
    if (this.isAdmin)
      if (this.isEditMode)
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
      else
        this.booksService
          .addBook(event)
          .pipe(take(1))
          .subscribe({
            next: (book) => {
              this.booksService.query(this.filterBy);
              this.bookToEdit = {} as Book;
              this.isEditMode = false;
            },
            error: (err) => console.error(err),
          });
  }

  private _isBookHasEmptyFields(book: Book): boolean {
    return (
      !book.title ||
      !book.author ||
      !book.description ||
      !book.category ||
      !book.imgUrl ||
      book.price === null ||
      book.price === undefined
    );
  }

  onCloseModal() {
    this.bookToEdit = {} as Book;
  }

  onChangePage(page: number, nextPrev: boolean = false) {
    const filter = { ...this.filterBy };
    if (!this.filterBy.pageIdx || !filter.pageIdx) return;
    if (nextPrev)
      if (filter.pageIdx + page < 1 || filter.pageIdx + page > this.maxPages)
        return;
      else filter.pageIdx += page;
    else filter.pageIdx = page;
    this.booksService.query(filter);
  }

  addToCart(event: MouseEvent, bookId: string) {
    event.stopPropagation();
    if (!this.isLogedInUser) {
      this.router.navigate(['auth']);
      return;
    }
    this.cartService.addBook(bookId);
  }

  deleteBook(event: MouseEvent, bookId: string) {
    event.stopPropagation();
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
