import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Notif } from '../services/notif.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(Auth);
    const notifService = inject(Notif);

    const token = authService.getToken();
    const isAuth = req.headers.get('isAuth') === 'true';
    let reqClone = req;

    if (req.url.includes('/register') || req.url.includes('/login')) {
        return next(req);
    }

    if (req.url.includes('/refresh')) {
        return next(req);
    }

    if (token && isAuth) {
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

                        const retryReq = req.clone({
                            setHeaders: {
                                'X-Authorization': res.accessToken
                            }
                        })

                        return next(retryReq);
                    }),
                    catchError(() => {
                        authService.logout();
                        authService.afterLogout();
                        return throwError(() => error);
                    })
                )
            }
            notifService.setErrorMessage(error.error?.message);
            return throwError(() => error);
        })
    );
};
