import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { AsyncStorageService } from './async-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cartItemsSub = new BehaviorSubject<ICart[]>([] as ICart[]);
  $cartItems = this._cartItemsSub.asObservable();
  private _cartCounterSub = new BehaviorSubject<number>(0);
  $cartCounter = this._cartCounterSub.asObservable();
  private CART_DB = 'cartDB';

  constructor(private storageService: AsyncStorageService) {
    this.query();
  }

  query() {
    this.storageService.query(this.CART_DB).subscribe({
      next: (cart) => {
        this._cartItemsSub.next(cart);
        this._cartCounterSub.next(cart[0].cartCounter);
      },
      error: (err) => console.log(err),
    });
  }

  addBook(bookId: string) {
    let cartItem: ICart = { bookId, dateAdded: new Date(), quantity: 1 };
    const cartItemIdx = this._cartItemsSub.value.findIndex(
      (item) => item.bookId === bookId
    );

    if (cartItemIdx !== -1) this._cartItemsSub.value[cartItemIdx].quantity++;
    else this._cartItemsSub.next([...this._cartItemsSub.value, cartItem]);
    this._cartCounterSub.next(this._cartCounterSub.value + 1);
    this.storageService
      .post(this.CART_DB, {
        cartItems: this._cartItemsSub.value,
        cartCounter: this._cartCounterSub.value,
      })
      .subscribe({
        next: (s) => console.log(s),
        error: (err) => console.error(err),
      });
  }
}

export interface ICart {
  bookId: string;
  dateAdded: Date;
  quantity: number;
}
