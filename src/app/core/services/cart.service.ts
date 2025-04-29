import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, take, tap } from 'rxjs';
import { AsyncStorageService } from './async-storage.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cartItemsSub = new BehaviorSubject<ICartItem[]>([] as ICartItem[]);
  $cartItems = this._cartItemsSub.asObservable();
  private _cartCounterSub = new BehaviorSubject<number>(0);
  $cartCounter = this._cartCounterSub.asObservable();
  private CART_DB = 'cartDB';
  private userID = '';
  private _cart: Cart = new Cart(this.userID);

  constructor(
    private storageService: AsyncStorageService,
    private userService: UserService
  ) {
    this.query();
  }

  query() {
    this.userService.$currentUser.subscribe((user) => {
      if (user.id != undefined) this.userID = user.id;
      else this.userID = 'visitor';
      this._cart = new Cart(this.userID);
      this.storageService
        .get<ICart>(this.CART_DB, this.userID)
        .pipe(take(1))
        .subscribe({
          next: (cart) => {
            this._cart = cart;
            this._cartItemsSub.next(cart.items);
            this._cartCounterSub.next(cart.cartCounter);
          },
          error: (err) => {
            console.error(err, this._cart);
            this._cartItemsSub.next(this._cart.items);
            this._cartCounterSub.next(this._cart.cartCounter);
            this.storageService.post(this.CART_DB, this._cart).subscribe({
              next: () => console.log('cart saved'),
              error: (err) => console.error(err),
            });
          },
        });
    });
  }

  addBook(bookId: string) {
    
  }

  remove(bookId: string) {
    
  }

  purchase() {
    this._cartCounterSub.next(0);
    this._cartItemsSub.next([]);
    this._cart = new Cart(this.userID);
    this.storageService
      .put(this.CART_DB, this._cart)
      .subscribe({ next: () => this.query() });
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
