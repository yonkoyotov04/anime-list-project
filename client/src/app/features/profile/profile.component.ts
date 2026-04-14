import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth } from '../../core/services/auth.service';
import { User } from '../../shared/interfaces/user';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { DeletePromptComponent } from '../../shared/components/delete-prompt/delete-prompt.component';
import { Review } from '../../shared/interfaces/review';
import { Api } from '../../core/services/api.service';
import { ReviewItemComponent } from '../../shared/components/review-item/review-item.component';

@Component({
    selector: 'app-profile',
    imports: [RouterLink, DeletePromptComponent, ReviewItemComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
    private activatedRoute = inject(ActivatedRoute);

    user = signal<User|null>(null);
    userId = signal<string | null>(null);
    ownProfile = signal<boolean>(false);
    deleteBox = signal<boolean>(false);
    deletedItemType = signal<string | null>(null);
    deletedItemId = signal<string | null>(null);
    reviews = signal<Review[]>([]);

    constructor(private authService: Auth, private apiService: Api, private router: Router) {}
    
    id = this.activatedRoute.snapshot.params['userId'];

    ngOnInit(): void {
        if (this.id) {
            this.userId.set(this.id);
        } else {
            this.userId.set(this.authService.user()._id)
            this.ownProfile.set(true);
        }

        this.authService.getUserData(this.userId()!).subscribe((userData) => {
            this.user.set(userData);
        })

        this.apiService.getReviewsForUser(this.userId()!).subscribe((reviews) => {
            this.reviews.set(reviews);
        })
    }

    showDeleteBox(type: string, id?: string) {
        this.deleteBox.set(true);
        this.deletedItemType.set(type)
        
        if (id) {
            this.deletedItemId.set(id);
        }
    }

    hideDeleteBox() {
        this.deleteBox.set(false);
        this.deletedItemType.set(null);
    }

    delete(userId: string) {
        this.authService.deleteUser(userId).subscribe(() => {
            this.authService.logout();
            this.authService.afterLogout();
            this.router.navigateByUrl('/');
        });
    }

    deleteReview(reviewId: string) {
        this.apiService.deleteReview(reviewId).subscribe(() => {
            this.reviews.update((reviews) => reviews!.filter(review => review._id !== reviewId));
            this.deleteBox.set(false);
        })
    }
    
}
