import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _currentUserSub = new BehaviorSubject<User>({} as User);
  public $currentUser = this._currentUserSub.asObservable();
  private _isAuthanticatedSub = new BehaviorSubject<boolean>(false);
  public $isAuthenticated = this._isAuthanticatedSub.asObservable();
  private API_KEY = '/account'

  constructor(
    private router: Router,
    private apiService: ApiService,
    private jwtService: JwtService
  ) {}

  populate() {
    if (this.jwtService.getToken()) {
      this._isAuthanticatedSub.next(true);
      this.apiService.get(this.API_KEY).subscribe({
        next: (data) => this.setAuth(data),
        error: (err) => this.purgeAuth(),
      });
    } else this.purgeAuth();
  }

  setAuth(user: User) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.token);
    // Set current user data into observable
    this._currentUserSub.next(user);
    // Set isAuthenticated to true
    this._isAuthanticatedSub.next(true);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this._currentUserSub.next({} as User);
    // Set auth status to false
    this._isAuthanticatedSub.next(false);
    this.router.navigateByUrl('auth');
  }

  atteptAuth(type: string, credentials: object): Observable<User> {
    const route = type === 'login' ? '/login' : '';
    return this.apiService.post(this.API_KEY + route, credentials).pipe(
      map((data) => {
        this.setAuth(data);
        return data;
      })
    );
  }
}
