import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Anime } from '../../shared/interfaces/anime';
import { Review } from '../../shared/interfaces/review';

@Injectable({
    providedIn: 'root',
})
export class Api {
    private apiUrl = 'http://localhost:1298'

    constructor(private http: HttpClient) { }

    getAnime(): Observable<Anime[]> {
        return this.http.get<Anime[]>(`${this.apiUrl}/anime/`);
    }

    getSpecificAnime(id: string): Observable<Anime> {
        return this.http.get<Anime>(`${this.apiUrl}/anime/${id}`);
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
