import { Component, computed, OnInit, Signal, signal } from '@angular/core';
import { Api } from '../../core/services/api.service';
import { Auth } from '../../core/services/auth.service';
import { ListItem } from '../../shared/interfaces/list-item';
import { AnimeListItemComponent } from '../../shared/components/anime-list-item/anime-list-item.component';

@Component({
    selector: 'app-my-list',
    imports: [AnimeListItemComponent],
    templateUrl: './my-list.component.html',
    styleUrl: './my-list.component.css',
})
export class MyListComponent implements OnInit {

    private allAnimes = signal<ListItem[]|null>(null)

    watching = computed(() => {return this.allAnimes()?.filter(item => item.status === 'Watching')});
    completed = computed(() => {return this.allAnimes()?.filter(item => item.status === 'Completed')});
    dropped = computed(() => {return this.allAnimes()?.filter(item => item.status === 'Dropped')});
    

    constructor(private apiService: Api, private authService: Auth) {}

    ngOnInit(): void {
        this.authService.getAnimeList().subscribe((user: any) => {
            this.allAnimes.set(user.animeList);
        })
    }

}
