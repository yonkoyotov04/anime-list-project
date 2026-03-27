import { Component, computed, OnInit, Signal, signal } from '@angular/core';
import { Api } from '../../core/services/api.service';
import { Auth } from '../../core/services/auth.service';
import { ListItem } from '../../shared/interfaces/list-item';
import { AnimeListItemComponent } from '../../shared/components/anime-list-item/anime-list-item.component';
import { List } from '../../core/services/list.service';

@Component({
    selector: 'app-my-list',
    imports: [AnimeListItemComponent],
    templateUrl: './my-list.component.html',
    styleUrl: './my-list.component.css',
})
export class MyListComponent implements OnInit {

    constructor( public listService: List) {}

    ngOnInit(): void {
        this.listService.loadAnimeList()
    }

   

}
