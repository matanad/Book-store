import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../services/user.service';
import { map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    return this.userService.$isAuthenticated.pipe(
      take(1),
      map((isAuthenticated) => {
        const shouldRedirect = isAuthenticated === state.url.includes('auth');
        if (shouldRedirect) {
          this.router.navigate(isAuthenticated ? [''] : ['/auth']);
          return false;
        }
        return true;
      })
    );
  }
}
