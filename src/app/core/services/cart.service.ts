import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cartItemsSub = new BehaviorSubject<ICart[]>([] as ICart[]);
  $cartItems = this._cartItemsSub.asObservable();
  private _cartCounterSub = new BehaviorSubject<number>(0);
  $cartCounter = this._cartCounterSub.asObservable();
  constructor() {}

  addBook(bookId: string) {
    let cartItem: ICart = { bookId, dateAdded: new Date(), quantity: 1 };
    const cartItemIdx = this._cartItemsSub.value.findIndex(
      (item) => item.bookId === bookId
    );

    if (cartItemIdx !== -1) this._cartItemsSub.value[cartItemIdx].quantity++;
    else this._cartItemsSub.next([...this._cartItemsSub.value, cartItem]);
    this._cartCounterSub.next(this._cartCounterSub.value + 1);
  }
}

export interface ICart {
  bookId: string;
  dateAdded: Date;
  quantity: number;
}
