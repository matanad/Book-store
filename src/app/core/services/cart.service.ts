import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, take, tap } from 'rxjs';
import { AsyncStorageService } from './async-storage.service';
import { OperationQueueService } from './operation-queue.service';
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
    private queueService: OperationQueueService,
    private userService: UserService
  ) {
    this.query();
  }

  query() {
    this.userService.$currentUser.subscribe((user) => {
      console.log('hiii', user.id);
      this.userID = user.id;
      this._cart = new Cart(user.id);
      this.storageService
        .get<ICart>(this.CART_DB, user.id)
        .pipe(take(1))
        .subscribe({
          next: (cart) => {
            this._cart = cart;
            this._cartItemsSub.next(cart.items);
            this._cartCounterSub.next(cart.cartCounter);
          },
          error: (err) => {
            console.error(err);
            this._cartItemsSub.next(this._cart.items);
            this._cartCounterSub.next(this._cart.cartCounter);
          },
        });
    });
  }

  addBook(bookId: string) {
    if (this.userID === '') return;
    this.queueService.addTask(() => {
      let cartItem: CartItem = new CartItem(bookId);
      let cartItemIdx = this._cart.items.findIndex(
        (item) => item.id === bookId
      );

      if (cartItemIdx >= 0) {
        this._cart.items[cartItemIdx].quantity++;
        this._cart.cartCounter++;

        return this.storageService.put(this.CART_DB, this._cart).pipe(
          take(1),
          tap({
            next: (cart) => {
              this._cartCounterSub.next(cart.cartCounter);
              this._cartItemsSub.next(cart.items);
              this._cart = cart;
            },
            error: (err) => {
              this.storageService
                .get<Cart>(this.CART_DB, this.userID)
                .pipe(take(1))
                .subscribe({
                  next: (cart) => {
                    this._cartCounterSub.next(cart.cartCounter);
                    this._cartItemsSub.next(cart.items);
                    this._cart = cart;
                    console.error(
                      'Error occurred, data updated from server',
                      err
                    );
                  },
                  error: (serverErr) => {
                    console.error(
                      'Error fetching cart from server:',
                      serverErr
                    );
                  },
                });
              console.error('Error updating cart, reverting changes', err);
            },
          })
        );
      } else {
        this._cart.items.push(cartItem);
        this._cart.cartCounter++;

        return this.storageService.post(this.CART_DB, this._cart).pipe(
          take(1),
          tap({
            next: (cart) => {
              this._cartCounterSub.next(cart.cartCounter);
              this._cartItemsSub.next(cart.items);
            },
            error: (err) => {
              // במקרה של שגיאה, אנו מבקשים את המידע מהשרת מחדש
              this.storageService
                .get<Cart>(this.CART_DB, this.userID)
                .pipe(take(1))
                .subscribe({
                  next: (cart) => {
                    this._cartCounterSub.next(cart.cartCounter);
                    this._cartItemsSub.next(cart.items);
                    this._cart = cart;
                    console.error(
                      'Error occurred, data updated from server',
                      err
                    );
                  },
                  error: (serverErr) => {
                    console.error(
                      'Error fetching cart from server:',
                      serverErr
                    );
                  },
                });
              console.error(
                'Error adding item to cart, reverting changes',
                err
              );
            },
          })
        );
      }
    });
  }

  remove(bookId: string) {
    this.queueService.addTask(() => {
      let cartItemIdx = this._cart.items.findIndex(
        (item) => item.id === bookId
      );
      let cartItem = this._cart.items[cartItemIdx];

      if (cartItem === undefined) return of(null);

      this._cart.cartCounter -= cartItem.quantity;
      this._cart.items.splice(cartItemIdx, 1);
      this._cartItemsSub.next([...this._cart.items]);
      this._cartCounterSub.next(this._cart.cartCounter);

      return this.storageService.put(this.CART_DB, this._cart).pipe(
        take(1),
        catchError((err) => {
          console.error(err);
          return this.storageService.query<Cart>(this.CART_DB).pipe(
            take(1),
            tap((cart) => {
              this._cart = cart[0];
              this._cartItemsSub.next(cart[0].items);
              this._cartCounterSub.next(cart[0].cartCounter);
            })
          );
        })
      );
    });
  }

  purchase() {
    this.storageService
      .remove(this.CART_DB, this._cart.id)
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
