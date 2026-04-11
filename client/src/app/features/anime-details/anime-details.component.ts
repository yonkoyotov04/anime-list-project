import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Api } from '../../core/services/api.service';
import { Anime } from '../../shared/interfaces/anime';
import { Auth } from '../../core/services/auth.service';
import { DeletePromptComponent } from '../../shared/components/delete-prompt/delete-prompt.component';
import { CommonModule } from '@angular/common';
import { Review } from '../../shared/interfaces/review';
import { ReviewItemComponent } from '../../shared/components/review-item/review-item.component';

@Component({
    selector: 'app-anime-details',
    imports: [DeletePromptComponent, ReviewItemComponent, CommonModule, RouterLink, RouterModule],
    templateUrl: './anime-details.component.html',
    styleUrl: './anime-details.component.css',
})
export class AnimeDetailsComponent implements OnInit {
    private activatedRoute = inject(ActivatedRoute);
    currentAnime = signal<Anime | null>(null);
    reviews = signal<Review[]>([]);
    isWatched = signal<boolean>(false);
    hasLeftReview = signal<boolean>(false);
    userId = signal<string | null>(null);
    deleteBox = signal<boolean>(false);

    constructor(private apiService: Api, private authService: Auth, private router: Router) { }

    animeId = this.activatedRoute.snapshot.params['animeId'];


    ngOnInit(): void {
        this.apiService.getSpecificAnime(this.animeId).subscribe((anime) => {
            this.currentAnime.set(anime);
        })

        this.authService.getUserData().subscribe((user) => {
            this.userId.set(user._id);
            this.isWatched.set(user.animeList.some(item => item.anime.toString() === this.animeId));
        })

        this.apiService.getReviewsForAnime(this.animeId).subscribe((reviews) => {
            this.reviews.set(reviews);
            this.hasLeftReview.set(reviews.some(review => review.user._id.toString() === this.userId()));
        })

        
    }

    handleWatched(): void {
        if (this.isWatched()) {
            this.authService.removeAnimeFromList(this.animeId).subscribe(() => {
                this.isWatched.set(false);
                this.currentAnime.update(anime => ({...anime!, currentlyWatched: anime!.currentlyWatched - 1}))
            })

        } else {
            this.authService.addAnimeToList(this.animeId).subscribe(() => {
                this.isWatched.set(true);
                this.currentAnime.update(anime => ({...anime!, currentlyWatched: anime!.currentlyWatched + 1}))
            })
        }
    }

    showDeleteBox() {
        this.deleteBox.set(true);
    }

    hideDeleteBox() {
        this.deleteBox.set(false);
    }

    delete(id: string) {
        this.apiService.deleteAnime(id).subscribe(() => {
            this.router.navigateByUrl('/catalogue');
        })
    }
}
