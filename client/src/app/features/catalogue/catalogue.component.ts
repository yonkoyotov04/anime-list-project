import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Api } from '../../core/services/api.service';
import { Anime } from '../../shared/interfaces/anime';
import { AnimeItemComponent } from '../../shared/components/anime-item/anime-item.component';

@Component({
    selector: 'app-catalogue',
    imports: [AnimeItemComponent],
    templateUrl: './catalogue.component.html',
    styleUrl: './catalogue.component.css',
})
export class CatalogueComponent implements OnInit {
    animes = signal<Anime[]>([]);

    constructor(private apiService: Api) { }

    ngOnInit(): void {
        this.apiService.getAnime().subscribe((animes) => {
            this.animes.set(animes);
        })
    }
}
