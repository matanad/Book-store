import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { AsyncStorageService } from './async-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cartItemsSub = new BehaviorSubject<ICartItem[]>([] as ICartItem[]);
  $cartItems = this._cartItemsSub.asObservable();
  private _cartCounterSub = new BehaviorSubject<number>(0);
  $cartCounter = this._cartCounterSub.asObservable();
  private CART_DB = 'cartDB';
  private USER_ID = 'fsdf456';
  private _cart: Cart = new Cart(this.USER_ID);

  constructor(private storageService: AsyncStorageService) {
    this.query();
  }

  query(userId: string = this.USER_ID) {
    this.storageService.get<ICart>(this.CART_DB, userId).subscribe({
      next: (cart) => {
        this._cart = cart;
        this._cartItemsSub.next(cart.items);
        this._cartCounterSub.next(cart.cartCounter);
      },
      error: (err) => console.log(err),
    });
  }

  addBook(bookId: string) {
    let cartItem: CartItem = new CartItem(bookId);
    let cartItemIdx = this._cart.items.findIndex((item) => item.id === bookId);

    if (cartItemIdx >= 0) {
      this._cart.items[cartItemIdx].quantity++;
      this._cart.cartCounter++;
      this.storageService.put(this.CART_DB, this._cart).subscribe({
        next: (cart) => {
          this._cartCounterSub.next(cart.cartCounter);
          this._cartItemsSub.next(cart.items);
          this._cart = cart;
          console.log(cart);
        },
        error: (err) => {
          this._cart.items[cartItemIdx].quantity--;
          this._cart.cartCounter--;
          console.error(err);
        },
      });
    } else {
      this._cart.items.push(cartItem);
      this._cart.cartCounter++;
      this.storageService.post(this.CART_DB, this._cart).subscribe({
        next: (cart) => {
          this._cartCounterSub.next(cart.cartCounter);
          this._cartItemsSub.next(cart.items);
        },
        error: (err) => {
          this._cart.items.pop();
          this._cart.cartCounter--;
          console.error(err);
        },
      });
    }
  }

  removeOne(bookId: string) {
    let cartItemIdx = this._cart.items.findIndex((item) => item.id === bookId);
    let cartItem = this._cart.items[cartItemIdx];
    if (cartItem == undefined || cartItem.quantity === 0) return;

    cartItem.quantity--;
    this._cart.cartCounter--;
    this.storageService.put(this.CART_DB, this._cart).subscribe({
      next: (cart) => {
        this._cartItemsSub.next(cart.items);
        this._cartCounterSub.next(cart.cartCounter);
      },
      error: (err) => {
        cartItem.quantity++;
        this._cart.cartCounter++;
        console.error(err);
      },
    });
  }
}

export interface ICartItem {
  id: string;
  dateAdded: Date;
  quantity: number;
}

interface ICart {
  id: string;
  createdAt: Date;
  items: ICartItem[];
  cartCounter: number;
}

class Cart implements ICart {
  constructor(
    public id: string,
    public createdAt: Date = new Date(),
    public items: ICartItem[] = [],
    public cartCounter: number = 0
  ) {}
}

class CartItem implements ICartItem {
  constructor(
    public id: string,
    public dateAdded: Date = new Date(),
    public quantity: number = 1
  ) {}
}
