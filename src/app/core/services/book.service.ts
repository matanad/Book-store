import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  max,
  Observable,
  take,
  tap,
  throwError,
} from 'rxjs';
import booksJSON from '../../../data/books.json';
import { AsyncStorageService } from './async-storage.service';
import { Book, BookListResponse, IBooksFilter } from '../models/book.model';
import { UserService } from './user.service';
import { _IdGenerator } from '@angular/cdk/a11y';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private _booksSub = new BehaviorSubject<Book[]>([]);
  public $books = this._booksSub.asObservable();
  private _isLoadingSub = new BehaviorSubject<boolean>(false);
  public $isLoading = this._isLoadingSub.asObservable();
  private PAGE_SIZE: number = 10;
  private _activeFilterSub = new BehaviorSubject<IBooksFilter>({
    page: 1,
    pageSize: this.PAGE_SIZE,
  });
  public $activeFilter = this._activeFilterSub.asObservable();
  private STORAGE_KEY = 'booksDB';
  private _maxPages = 1;
  private _isAdmin: boolean = false;
  private API_KEY = '/books';

  constructor(
    private storageService: AsyncStorageService,
    private userService: UserService,
    private apiService: ApiService
  ) {
    const books = localStorage.getItem(this.STORAGE_KEY);
    if (!books)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(booksJSON));
    userService.$currentUser.subscribe({
      next: (user) => (this._isAdmin = user.isAdmin),
    });
  }

  fetchBooks(filter: IBooksFilter = this._activeFilterSub.value) {
    this._isLoadingSub.next(true);
    const options = new HttpParams({ fromObject: filter });

    return this.apiService
      .get(this.API_KEY, options)
      .pipe(
        take(1),
        tap<BookListResponse>((res) => {
          this._maxPages = res.totalPages;
          this._booksSub.next(res.books);
        }),
        catchError((err) => {
          this._maxPages = 1;
          this._booksSub.next([]);
          return throwError(() => err);
        }),
        finalize(() => {
          this._isLoadingSub.next(false);
          this._activeFilterSub.next({ ...this._activeFilterSub.value, ...filter });
        })
      )
      .subscribe();
  }

  query(filterBy: IBooksFilter) {
    this._isLoadingSub.next(true);
    this._activeFilterSub.next({ ...filterBy });
    this.storageService.query<Book>(this.STORAGE_KEY).subscribe(
      (res) => {
        let filteredBooks = res;
        filteredBooks = this._filterBooksByCriteria(filteredBooks, filterBy);
        filteredBooks = this._sortBooksBy(filteredBooks, filterBy);
        filteredBooks = this._paginateBooks(filteredBooks, filterBy);
        this._booksSub.next(filteredBooks);
        this._isLoadingSub.next(false);
      },
      (err) => console.error(err)
    );
  }

  getMaxPages() {
    return this._maxPages;
  }

  getGeneres() {
    return this.storageService
      .query<Book>(this.STORAGE_KEY)
      .pipe(map((books) => [...new Set(books.map((book) => book.category))]));
  }

  addBook(newBook: Book) {
    if (newBook.id === '') newBook.id = _generateId();
    return this.storageService.post(this.STORAGE_KEY, newBook);
  }

  private _paginateBooks(books: Book[], filterBy: IBooksFilter) {
    this._maxPages =
      Math.floor(books.length / this.PAGE_SIZE) +
      (books.length % this.PAGE_SIZE ? 1 : 0);
    if (filterBy.page === undefined || this._maxPages === 1) return books;
    const startIdx = Math.min(
      +(filterBy.page - 1) * this.PAGE_SIZE,
      books.length
    );
    const endIdx = Math.min(startIdx + this.PAGE_SIZE, books.length);
    return books.slice(startIdx, endIdx);
  }

  private _sortBooksBy(books: Book[], filterBy: IBooksFilter): Book[] {
    if (!filterBy.sort) return books;
    const sortBy = filterBy.sort as keyof Book;
    return books.sort(
      (bookA, bookB) =>
        ('' + bookA[sortBy]).localeCompare('' + bookB[sortBy]) *
        (filterBy.order || 1)
    );
  }

  private _filterBooksByCriteria(
    books: Book[],
    filterBy: IBooksFilter
  ): Book[] {
    const filterKeys = ['title', 'description', 'author', 'category'];
    return books.filter((book) =>
      filterKeys.every((key) => {
        if (!filterBy[key]) return true;
        const regex = new RegExp(filterBy[key], 'i');
        return regex.test(book[key as keyof Book].toString());
      })
    );
  }

  getById(bookId: string): Observable<Book> {
    return this.apiService.get(this.API_KEY + '/' + bookId).pipe(take(1));
  }

  remove(bookId: string): Observable<Book> {
    if (!this._isAdmin) return throwError(() => new Error('No Permission'));
    return this.storageService.remove<Book>(this.STORAGE_KEY, bookId);
  }

  save(book: Book): Observable<Book> {
    if (book.id) return this.storageService.put(this.STORAGE_KEY, book);
    else return this.storageService.post(this.STORAGE_KEY, book);
  }
}

function _generateId(length: number = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < length; i++)
    id += chars[Math.floor(Math.random() * chars.length)];

  return id;
}
