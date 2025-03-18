import { Injectable } from '@angular/core';
import { BehaviorSubject, max, Observable } from 'rxjs';
import booksJSON from '../../../data/books.json';
import { AsyncStorageService } from './async-storage.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private _booksSub = new BehaviorSubject<Book[]>([]);
  public $books = this._booksSub.asObservable();
  private _activeFilterSub = new BehaviorSubject<IFilter>({});
  public $activeFilter = this._activeFilterSub.asObservable();
  private PAGE_SIZE: number = 12;
  private STORAGE_KEY = 'booksDB';
  private _maxPages = 1;

  constructor(private storageService: AsyncStorageService) {
    const books = localStorage.getItem(this.STORAGE_KEY);
    if (!books)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(booksJSON));
  }

  query(filterBy: IFilter) {
    this._activeFilterSub.next({ ...filterBy });
    this.storageService.query(this.STORAGE_KEY).subscribe(
      (res) => {
        let filteredBooks = res;
        filteredBooks = this._filterBooksByCriteria(filteredBooks, filterBy);
        filteredBooks = this._sortBooksBy(filteredBooks, filterBy);
        filteredBooks = this._paginateBooks(filteredBooks, filterBy);
        this._booksSub.next(filteredBooks);
      },
      (err) => console.log(err)
    );
  }

  getMaxPages() {
    return this._maxPages;
  }

  private _paginateBooks(books: Book[], filterBy: IFilter) {
    this._maxPages =
      Math.floor(books.length / this.PAGE_SIZE) +
      (books.length % this.PAGE_SIZE ? 1 : 0);
    if (filterBy.pageIdx === undefined || this._maxPages === 1) return books;
    const startIdx = Math.min(
      +(filterBy.pageIdx - 1) * this.PAGE_SIZE,
      books.length
    );
    const endIdx = Math.min(startIdx + this.PAGE_SIZE, books.length);
    return books.slice(startIdx, endIdx);
  }

  private _sortBooksBy(books: Book[], filterBy: IFilter): Book[] {
    if (!filterBy.sort) return books;
    const sortBy = filterBy.sort as keyof Book;
    return books.sort(
      (bookA, bookB) =>
        ('' + bookA[sortBy]).localeCompare('' + bookB[sortBy]) *
        (filterBy.order || 1)
    );
  }

  private _filterBooksByCriteria(books: Book[], filterBy: IFilter): Book[] {
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
    return this.storageService.get(this.STORAGE_KEY, bookId);
  }

  remove(bookId: string): Observable<Book> {
    return this.storageService.remove(this.STORAGE_KEY, bookId);
  }

  save(book: Book): Observable<Book> {
    if (book.id) return this.storageService.put(this.STORAGE_KEY, book);
    else return this.storageService.post(this.STORAGE_KEY, book);
  }
}

interface IBook {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  imgUrl: string;
  price: number;
}

export class Book implements IBook {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public description: string,
    public category: string,
    public imgUrl: string,
    public price: number
  ) {}

  static fromJson(bookJson: any): Book {
    return new Book(
      bookJson.id,
      bookJson.title,
      bookJson.author,
      bookJson.description,
      bookJson.category,
      bookJson.imgUrl,
      bookJson.price
    );
  }
}

export interface IFilter {
  pageIdx?: number;
  sort?: string;
  order?: number;
  title?: string;
  description?: string;
  author?: string;
  category?: string;
  [key: string]: any;
}
