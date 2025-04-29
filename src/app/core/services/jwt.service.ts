import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private _TOKEN_KEY = 'jwtToken';

  getToken(): string {
    return localStorage[this._TOKEN_KEY];
  }

  saveToken(token: string) {
    localStorage[this._TOKEN_KEY] = token;
  }

  destroyToken() {
    localStorage.removeItem(this._TOKEN_KEY);
  }
}
