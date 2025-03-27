import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../../core/services/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { Book, IBooksFilter } from '../../../../core/models/book.model';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-book-details',
  standalone: false,
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent implements OnInit {
  book!: Book;
  isLogedInUser = false;

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private booksService: BookService,
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe((params) => {
      const bookId = params.get('id');
      if (bookId == null) {
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
    this.userService.$isAuthenticated.subscribe({
      next: (isAuth) => (this.isLogedInUser = isAuth),
    });
  }

  addToCart(event: MouseEvent, bookId: string) {
    event.stopPropagation();
    if (!this.isLogedInUser) {
      this.router.navigate(['auth']);
      return;
    }
    this.cartService.addBook(bookId);
  }

  onGenereClick(category: string) {
    const filter: IBooksFilter = { pageIdx: 1, category };
    this.booksService.query(filter);
    this.router.navigateByUrl('');
  }
}
