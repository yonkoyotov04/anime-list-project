import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../../core/services/api.service';
import { Anime } from '../../shared/interfaces/anime';

@Component({
    selector: 'app-anime-details',
    imports: [],
    templateUrl: './anime-details.component.html',
    styleUrl: './anime-details.component.css',
})
export class AnimeDetailsComponent implements OnInit {
    private activatedRoute = inject(ActivatedRoute);
    currentAnime = signal<Anime|null>(null);

    constructor(private apiService: Api) {}

    animeId = this.activatedRoute.snapshot.params['animeId'];
    
    ngOnInit(): void {
        this.apiService.getSpecificAnime(this.animeId).subscribe((anime) => {
            this.currentAnime.set(anime);
        })
    }
}
