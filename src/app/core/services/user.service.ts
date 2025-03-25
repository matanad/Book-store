import { Injectable } from '@angular/core';
import { AsyncStorageService } from './async-storage.service';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private USER_DB = 'usersDB';
  private _currentUserSub = new BehaviorSubject<User>({} as User);
  public $currentUser = this._currentUserSub.asObservable();
  private _isAuthanticatedSub = new BehaviorSubject<boolean>(false);
  public $isAuthenticated = this._isAuthanticatedSub.asObservable();

  constructor(private storageService: AsyncStorageService) {
    let user: User | null | string;
    if (!this._isAuthanticatedSub.value) {
      user = localStorage.getItem('TOKEN');
      if (user != null) {
        user = JSON.parse(user) as User;
        storageService.get<User>(this.USER_DB, user.id).pipe(take(1)).subscribe((user) => {
            this._currentUserSub.next(user);
            this._isAuthanticatedSub.next(true);
            console.log(user);
          });
      }
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.storageService.query<User>(this.USER_DB).pipe(
      take(1),
      map((users) => {
        const user = users.find(
          (user) =>
            user.email === email && user.password === this._encript(password)
        );
        if (!user) {
          return false;
        }
        this._currentUserSub.next(user);
        this._isAuthanticatedSub.next(true);
        localStorage.setItem('TOKEN', JSON.stringify(user));
        return true;
      }),
      catchError((error) => {
        console.error(error);
        return of(false);
      })
    );
  }

  logout() {
    this._currentUserSub.next({} as User);
    this._isAuthanticatedSub.next(false);
    localStorage.removeItem('TOKEN');
  }

  signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<boolean> {
    const user: User = new User(
      this._generateId(),
      firstName,
      lastName,
      email,
      this._encript(password)
    );

    return this.storageService.query<User>(this.USER_DB).pipe(
      take(1),
      switchMap((users) => {
        const userExists = users.some(
          (u) => u.email === user.email || u.id === user.id
        );
        if (userExists) {
          return throwError(() => new Error('User already exists'));
        }
        return this.storageService.post(this.USER_DB, user).pipe(
          tap((res) => {
            this._currentUserSub.next(res);
          }),
          map(() => true),
          catchError((error) => {
            console.error(error);
            return of(false);
          })
        );
      }),
      catchError((error) => {
        console.error(error);
        return of(false);
      })
    );
  }

  private _generateId(length: number = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    for (let i = 0; i < length; i++)
      id += chars[Math.floor(Math.random() * chars.length)];

    return id;
  }

  private _encript(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}
