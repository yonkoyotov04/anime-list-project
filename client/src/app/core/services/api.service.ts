import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Anime } from '../../shared/interfaces/anime';
import { Review } from '../../shared/interfaces/review';
import { Auth } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class Api {
    private apiUrl = 'http://localhost:1298'
    private _animes = signal<Anime[] | null>(null);

    animes = this._animes.asReadonly();

    private getHeaders(method?: string) {
        if (method === 'post' || method === 'put') {
            return new HttpHeaders({
                'Content-Type': 'application/json',
                'X-Authorization': this.authService.user()?.accessToken
            })
        }

        return new HttpHeaders({
            'X-Authorization': this.authService.user()?.accessToken
        })

    }

    constructor(private http: HttpClient, private authService: Auth) { }

    getAnime(): Observable<Anime[]> {
        return this.http.get<Anime[]>(`${this.apiUrl}/anime/`);
    }

    getAnimeWithQuery(type: string, search: string): Observable<Anime[]> {
        return this.http.get<Anime[]>(`${this.apiUrl}/anime/?${type}=${search}`);
    }

    getSpecificAnime(id: string): Observable<Anime> {
        return this.http.get<Anime>(`${this.apiUrl}/anime/${id}`);
    }

    postAnime(animeData: any): Observable<Anime> {
        return this.http.post<Anime>(`${this.apiUrl}/anime`, animeData, { headers: this.getHeaders('post'), withCredentials: true });
    }

    postReview(animeId: string, reviewData: any): Observable<Review> {
        return this.http.post<Review>(`${this.apiUrl}/review/${animeId}`, reviewData, {headers: this.getHeaders('post'), withCredentials: true});
    }

    getOwnerStatus(id: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/anime/${id}/status`);
    }

    getReviewsForAnime(animeId: string): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.apiUrl}/review/anime/${animeId}`);
    }

    getReviewsForUser(userId: string): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.apiUrl}/review/user/${userId}`);
    }

    getSpecificReview(reviewId: string): Observable<Review> {
        return this.http.get<Review>(`${this.apiUrl}/review/${reviewId}`, { headers: this.getHeaders(), withCredentials: true });
    }

    getReviewedStatus(animeId: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/review/${animeId}/status`, { headers: this.getHeaders(), withCredentials: true });
    }

    editAnime(id: string, newData: any): Observable<Anime> {
        return this.http.put<Anime>(`${this.apiUrl}/anime/${id}`, newData, { headers: this.getHeaders('put'), withCredentials: true });
    }

    editReview(id: string, newData: any): Observable<Review> {
        return this.http.put<Review>(`${this.apiUrl}/review/${id}`, newData, { headers: this.getHeaders('put'), withCredentials: true });
    }

    deleteAnime(id: string): Observable<void> {
        return this.http.delete <void>(`${this.apiUrl}/anime/${id}`, { headers: this.getHeaders(), withCredentials: true });
    }

    deleteReview(id: string): Observable<void> {
        return this.http.delete <void>(`${this.apiUrl}/review/${id}`, { headers: this.getHeaders(), withCredentials: true });
    }
}
