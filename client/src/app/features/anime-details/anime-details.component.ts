import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../../core/services/api.service';
import { Anime } from '../../shared/interfaces/anime';
import { Auth } from '../../core/services/auth.service';

@Component({
    selector: 'app-anime-details',
    imports: [],
    templateUrl: './anime-details.component.html',
    styleUrl: './anime-details.component.css',
})
export class AnimeDetailsComponent implements OnInit {
    private activatedRoute = inject(ActivatedRoute);
    currentAnime = signal<Anime|null>(null);
    isWatched = signal<boolean>(false);

    constructor(private apiService: Api, private authService: Auth) {}

    animeId = this.activatedRoute.snapshot.params['animeId'];
    
    ngOnInit(): void {
        this.apiService.getSpecificAnime(this.animeId).subscribe((anime) => {
            this.currentAnime.set(anime);
        })

        this.authService.getUserData().subscribe((user) => {
            this.isWatched.set(user.animeList.some(item => item.animeId.toString() === this.animeId));
            console.log(this.isWatched());
        })
    }

    handleWatched(): void {
        if (this.isWatched()) {
            this.authService.removeAnimeFromList(this.animeId).subscribe(() => {
                this.isWatched.set(false);
            })

        } else {
            this.authService.addAnimeToList(this.animeId).subscribe(() => {
                this.isWatched.set(true);
            })
        }
    }
}
