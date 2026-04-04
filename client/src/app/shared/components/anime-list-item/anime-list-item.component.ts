import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListItem } from '../../interfaces/list-item';
import { List } from '../../../core/services/list.service';

@Component({
    selector: 'app-anime-list-item',
    imports: [RouterLink],
    templateUrl: './anime-list-item.component.html',
    styleUrl: './anime-list-item.component.css',
})
export class AnimeListItemComponent {

    constructor(public listService: List) {}

    @Input ({required: true}) data!: ListItem;
    @Input ({required: true}) isOwner!: boolean


}
