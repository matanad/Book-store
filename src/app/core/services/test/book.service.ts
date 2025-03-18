// import { Injectable } from '@angular/core';
// import { BehaviorSubject, map, Observable, of } from 'rxjs';
// import { saveAs } from 'file-saver';
// import booksJSON from '../../../data/books.json';

// @Injectable({
//   providedIn: 'root',
// })
// export class BookService {
//   private _allBooks: Book[] = [];
//   private _booksSub = new BehaviorSubject<Book[]>([]);
//   public $books = this._booksSub.asObservable();
//   private _activeFilter: IFilter = {};
//   private PAGE_SIZE: number = 6;

//   constructor() {
//     this._allBooks = [...booksJSON.map((book) => Book.fromJson(book))];
//     this._booksSub.next([...this._allBooks]);
//   }

//   query(filterBy: IFilter) {
//     let filteredBooks = this._allBooks;

//     filteredBooks = this._filterBooksByCriteria(filteredBooks, filterBy);
//     filteredBooks = this._sortBooksBy(filteredBooks, filterBy);
//     filteredBooks = this._paginateBooks(filteredBooks, filterBy);

//     this._booksSub.next(filteredBooks);
//   }

//   private _paginateBooks(books: Book[], filterBy: IFilter) {
//     if (filterBy.pageIdx === undefined) return books;
//     const startIdx = +filterBy.pageIdx * this.PAGE_SIZE;
//     return books.slice(startIdx, this.PAGE_SIZE + startIdx);
//   }

//   private _sortBooksBy(books: Book[], filterBy: IFilter): Book[] {
//     if (!filterBy.sort) return books;
//     const sortBy = filterBy.sort as keyof Book;
//     return books.sort(
//       (bookA, bookB) =>
//         ('' + bookA[sortBy]).localeCompare('' + bookB[sortBy]) *
//         (filterBy.order || 1)
//     );
//   }

//   private _filterBooksByCriteria(books: Book[], filterBy: IFilter): Book[] {
//     const filterKeys = ['title', 'description', 'author', 'category'];
//     return books.filter((book) =>
//       filterKeys.every((key) => {
//         if (!filterBy[key]) return true;
//         const regex = new RegExp(filterBy[key], 'i');
//         return regex.test(book[key as keyof Book]?.toString());
//       })
//     );
//   }

//   get(bookId: string) {
//     const book = this._allBooks.find((book) => book.id === bookId);
//     return of(book);
//   }

//   remove(bookId: string) {
//     this._allBooks = this._allBooks.filter((book) => book.id === bookId);
//     return this._writeBooksToFile();
//   }

//   save(book: Book): Observable<Book> {
//     if (book.id) {
//       const bookIdx = this._allBooks.findIndex(
//         (currBook) => currBook.id === book.id
//       );
//       this._allBooks[bookIdx] = book;
//     }
//     return this._writeBooksToFile().pipe(map(() => book));
//   }

//   private _writeBooksToFile(): Observable<void> {
//     return new Observable<void>((observer) => {
//       try {
//         const data = JSON.stringify(this._allBooks, null, 2);
//         const blob = new Blob([data], { type: 'application/json' });
//         saveAs(blob, '../../../data/books.json');
//         observer.next();
//         observer.complete();
//       } catch (err) {
//         observer.error(console.error(err));
//       }
//     });
//   }
// }

// interface IBook {
//   id: string;
//   title: string;
//   author: string;
//   description: string;
//   category: string;
//   imgUrl: string;
//   price: number;
// }

// export class Book implements IBook {
//   constructor(
//     public id: string,
//     public title: string,
//     public author: string,
//     public description: string,
//     public category: string,
//     public imgUrl: string,
//     public price: number
//   ) {}

//   static fromJson(bookJson: any): Book {
//     return new Book(
//       bookJson.id,
//       bookJson.title,
//       bookJson.author,
//       bookJson.description,
//       bookJson.category,
//       bookJson.imgUrl,
//       bookJson.price
//     );
//   }
// }

// interface IFilter {
//   pageIdx?: number;
//   sort?: string;
//   order?: number;
//   title?: string;
//   description?: string;
//   author?: string;
//   category?: string;
//   [key: string]: any;
// }
