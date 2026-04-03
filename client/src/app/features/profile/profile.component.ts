import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '../../core/services/auth.service';
import { User } from '../../shared/interfaces/user';
import { Router, RouterLink } from "@angular/router";
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
    user = signal<User|null>(null);
    
    deleteBox = signal<boolean>(false);
    reviews = signal<Review[]|null>(null);

    constructor(private authService: Auth, private apiService: Api, private router: Router) {}

    ngOnInit(): void {
        const userId = this.authService.user()._id

        this.authService.getUserData(userId).subscribe((userData) => {
            this.user.set(userData);
        })

        this.apiService.getReviewsForUser(userId).subscribe((reviews) => {
            this.reviews.set(reviews);
        })
    }

    showDeleteBox() {
        this.deleteBox.set(true);
    }

    hideDeleteBox() {
        this.deleteBox.set(false);
    }

    delete(userId: string) {
        this.authService.deleteUser(userId).subscribe(() => {
            this.authService.logout();
            this.router.navigateByUrl('/');
        });
    }
    
}
