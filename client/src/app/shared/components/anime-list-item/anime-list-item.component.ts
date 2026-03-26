import { Component, Input } from '@angular/core';
import { Anime } from '../../interfaces/anime';
import { RouterLink } from '@angular/router';
import { ListItem } from '../../interfaces/list-item';

@Component({
    selector: 'app-anime-list-item',
    imports: [RouterLink],
    templateUrl: './anime-list-item.component.html',
    styleUrl: './anime-list-item.component.css',
})
export class AnimeListItemComponent {
    @Input ({required: true}) data!: ListItem;
}
