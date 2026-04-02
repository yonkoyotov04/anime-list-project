import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Auth } from "../services/auth.service";

const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(Auth);
    const token = authService.getToken();

    if (token) {
        return true;
    }

    return router.navigateByUrl('/login');
}

export default authGuard;

