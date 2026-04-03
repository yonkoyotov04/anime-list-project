import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Auth } from './auth.service';
import { ListItem } from '../../shared/interfaces/list-item';

@Injectable({
    providedIn: 'root',
})
export class List {

    allAnimes = signal<ListItem[]>([]);

    watching = computed(() => { return this.allAnimes()?.filter(item => item.status === 'Watching') });
    completed = computed(() => { return this.allAnimes()?.filter(item => item.status === 'Completed') });
    dropped = computed(() => { return this.allAnimes()?.filter(item => item.status === 'Dropped') });

    constructor(private http: HttpClient, private authService: Auth) { }

    loadAnimeList() {
        this.authService.getAnimeList().subscribe((user: any) => {
            this.allAnimes.set(user.animeList);
        })
    }

    complete(animeId: string): void {
        this.authService.completeAnime(animeId).subscribe(() => {
            this.allAnimes.update(list => list!.map(item => item.anime._id === animeId ? { ...item, status: 'Completed' } : item));
        })
    }

    drop(animeId: string): void {
        this.authService.dropAnime(animeId).subscribe(() => {
            this.allAnimes.update(list => list!.map(item => item.anime._id === animeId ? { ...item, status: 'Dropped' } : item));
        })
    }

    remove(animeId: string): void {
        this.authService.removeAnimeFromList(animeId).subscribe(() => {
            this.allAnimes.update(list => list!.filter(item => item.anime._id !== animeId));
        })
    }
}
