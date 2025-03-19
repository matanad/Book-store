import { Component, OnInit } from '@angular/core';
import { CartService, ICart } from '../../core/services/cart.service';
import { Book, BookService } from '../../core/services/book.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  books: Book[] = [];
  cartItems: ICart[] = [];

  constructor(
    private cartService: CartService,
    private booksService: BookService
  ) {}

  ngOnInit(): void {
    this.cartService.$cartItems.subscribe({
      next: (items) => {
        this.cartItems = items;
        this.cartItems.forEach((cartItem) => {
          this.booksService.getById(cartItem.bookId).subscribe({
            next: (book) => this.books.push(book),
          });
        });
      },
    });
  }

  cartSum() {
    let sum = 0;
    this.books.forEach((books, index) => {
      sum += books.price * this.cartItems[index].quantity;
    });
    return sum;
  }
}
