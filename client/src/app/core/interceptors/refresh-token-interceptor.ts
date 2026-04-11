import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(Auth);

    const token = authService.getToken();
    let reqClone = req;

    if (req.url.includes('/register') || req.url.includes('/login')) {
        return next(req);
    }

    if (req.url.includes('/refresh')) {
        return next(req);
    }

    if (token) {
        reqClone = req.clone({
            setHeaders: {
                'X-Authorization': token
            }
        })
    }

    return next(reqClone).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                return authService.refreshToken().pipe(
                    switchMap((res: any) => {
                        authService.setUser({ ...authService.user(), accessToken: res.accessToken });
                        console.log('refresh');
                        

                        const retryReq = req.clone({
                            setHeaders: {
                                'X-Authorization': res.accessToken
                            }
                        })

                        return next(retryReq);
                    }),
                    catchError(() => {
                        authService.logout();
                        return throwError(() => error);
                    })
                )
            }
            return throwError(() => error);
        })
    );
};
