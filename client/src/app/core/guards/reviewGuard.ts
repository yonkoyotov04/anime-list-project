import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Api } from "../services/api.service";
import { map } from "rxjs";

const reviewGuard: CanActivateFn = (route, state) => {
    const apiService = inject(Api);
    const router = inject(Router);

    const animeId = route.paramMap.get('animeId');

    return apiService.getReviewedStatus(animeId!).pipe(
        map(hasReviewed => {
            if (hasReviewed) {
                router.navigateByUrl('/');
                return false;
            }

            return true;
        })
    )
}

export default reviewGuard;