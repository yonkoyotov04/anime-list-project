import { Component, inject, OnInit, signal} from '@angular/core';
import { AnimeListItemComponent } from '../../shared/components/anime-list-item/anime-list-item.component';
import { List } from '../../core/services/list.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-my-list',
    imports: [AnimeListItemComponent],
    templateUrl: './my-list.component.html',
    styleUrl: './my-list.component.css',
})
export class MyListComponent implements OnInit {
    private activatedRoute = inject(ActivatedRoute);

    ownList = signal<boolean>(false);

    constructor( public listService: List) {}

    id = this.activatedRoute.snapshot.params['userId'];

    ngOnInit(): void {
        if (this.id) {
            this.listService.loadAnimeList(this.id);
        } else {
            this.listService.loadAnimeList();
            this.ownList.set(true);
        }
        
    }

}
