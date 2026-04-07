import { Component, OnInit } from '@angular/core';
import { Auth } from '../../core/services/auth.service';
import { Api } from '../../core/services/api.service';
import { AnimeItemComponent } from '../../shared/components/anime-item/anime-item.component';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [AnimeItemComponent, RouterLink, RouterModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

    constructor(public apiService: Api, private authService: Auth) { }

    ngOnInit(): void {
        this.apiService.getAnime().subscribe((animes) => {
            this.apiService.setAnimes(animes);
        })
    }

    isAuthenticated() {
        return this.authService.isAuthenticated();
    }
}
