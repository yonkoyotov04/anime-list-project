import { Component, Input } from '@angular/core';
import { Anime } from '../../interfaces/anime';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-anime-list-item',
    imports: [RouterLink],
    templateUrl: './anime-list-item.component.html',
    styleUrl: './anime-list-item.component.css',
})
export class AnimeListItemComponent {
    @Input ({required: true}) anime!: Anime;
}
