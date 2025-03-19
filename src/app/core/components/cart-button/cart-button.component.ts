import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-button',
  standalone: false,
  templateUrl: './cart-button.component.html',
  styleUrl: './cart-button.component.scss',
})
export class CartButtonComponent implements OnInit {
  counter: number = 0;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.$cartCounter.subscribe({
      next: (cartCounter) => (this.counter = cartCounter),
    });
  }
}
