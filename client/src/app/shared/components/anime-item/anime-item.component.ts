import { Component, Input } from '@angular/core';
import { Anime } from '../../interfaces/anime';
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-anime-item',
    imports: [RouterLink],
    templateUrl: './anime-item.component.html',
    styleUrl: './anime-item.component.css',
})
export class AnimeItemComponent {
    @Input ({required: true}) anime!: Anime;
}
