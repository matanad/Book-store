import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../../core/services/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { CartService } from '../../../../core/services/cart.service';
import { Book, IBooksFilter } from '../../../../core/models/book.model';

@Component({
  selector: 'app-book-details',
  standalone: false,
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent implements OnInit {
  book!: Book;

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private booksService: BookService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe((params) => {
      const bookId = params.get('id');
      if (bookId == null) {
        console.log(bookId);

        this.router.navigateByUrl('');
      } else
        this.booksService.getById(bookId).subscribe({
          next: (book) => (this.book = book),
          error: (err) => {
            console.error(err + '.\nredirecting to books list');
            this.router.navigateByUrl('');
          },
        });
    });
  }

  addToCart(event: MouseEvent, bookId: string) {
    event.stopPropagation();
    this.cartService.addBook(bookId);
  }

  onGenereClick(category: string) {
    const filter: IBooksFilter = { pageIdx: 1, category };
    this.booksService.query(filter);
    this.router.navigateByUrl('');
  }
}
