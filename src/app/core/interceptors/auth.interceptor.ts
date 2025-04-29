import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  if (!req.url.includes('/auth') && jwtService.getToken())
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtService.getToken()}`,
      },
    });
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 40) {
        jwtService.destroyToken();
        if (!router.url.includes('auth')) router.navigate(['auth', 'login']);
      }
      return throwError(() => error);
    })
  );
};
