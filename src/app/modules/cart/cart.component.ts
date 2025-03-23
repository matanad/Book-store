import { Component, OnInit } from '@angular/core';
import { CartService, ICartItem } from '../../core/services/cart.service';
import {  BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  books: Book[] = [];
  cartItems: ICartItem[] = [];

  constructor(
    private cartService: CartService,
    private booksService: BookService
  ) {}

  ngOnInit(): void {
    this.cartService.$cartItems.subscribe({
      next: (items) => {
        this.cartItems = items;
        this.cartItems.forEach((cartItem) => {
          this.booksService.getById(cartItem.id).subscribe({
            next: (book) => {
              let bookIdx = this.books.findIndex(
                (book) => book.id === cartItem.id
              );
              if (bookIdx === -1) this.books.push(book);
              else this.books[bookIdx] = book;
            },
          });
        });
      },
    });
  }

  cartSum() {
    let sum = 0;
    this.books.forEach((books, index) => {
      if (this.cartItems[index] !== undefined)
        sum += books.price * this.cartItems[index].quantity;
    });
    return sum;
  }

  addToCart(event: MouseEvent, bookId: string) {
    event.stopPropagation();
    this.cartService.addBook(bookId);
  }

  removeOne(bookId: string) {
    this.cartService.removeOne(bookId);
  }

  remove(bookId: string) {
    this.cartService.remove(bookId);
    this.books = this.books.filter((book) => book.id !== bookId);
  }

  trackBy(index: number, item: Book) {
    return item.id;
  }
}
