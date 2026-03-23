import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Anime } from '../../shared/interfaces/anime';
import { Review } from '../../shared/interfaces/review';

@Injectable({
    providedIn: 'root',
})
export class Api {
    private apiUrl = 'http://localhost:1298'
    private _animes = signal<Anime[]|null>(null);

    animes = this._animes.asReadonly();

    constructor(private http: HttpClient) {}

    getAnime(): Observable<Anime[]> {
        return this.http.get<Anime[]>(`${this.apiUrl}/anime/`);
    }

    getSpecificAnime(id: string): Observable<Anime> {
        return this.http.get<Anime>(`${this.apiUrl}/anime/${id}`);
    }

    postAnime(animeData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/anime`, animeData);
    }

    getOwnerStatus(id: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/anime/${id}/status`);
    }

    getReviewsForAnime(id: string): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.apiUrl}/review/anime/${id}`);
    }

    getReviewsForUser(id: string): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.apiUrl}/review/user/${id}`);
    }
}
