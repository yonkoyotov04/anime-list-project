import { HttpClient} from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Anime } from '../../shared/interfaces/anime';
import { Review } from '../../shared/interfaces/review';

@Injectable({
    providedIn: 'root',
})
export class Api {
    private apiUrl = (window as any)._env.API_URL;
    private _animes = signal<Anime[]>([]);

    animes = this._animes.asReadonly();

    topTrending = computed(() => { return this._animes().sort((a, b) => b.currentlyWatched - a.currentlyWatched).slice(0, 5) });
    topPopular = computed(() => { return this._animes().sort((a, b) => (b.completed + b.dropped) - (a.completed + a.dropped)).slice(0, 5) });
    topRated = computed(() => { return this._animes().sort((a, b) => b.rating - a.rating).slice(0, 5) });
    topLowestRated = computed(() => { return this._animes().sort((a, b) => a.rating - b.rating).slice(0, 5) });

    constructor(private http: HttpClient) { }

    getAnime(): Observable<Anime[]> {
        return this.http.get<Anime[]>(`${this.apiUrl}/anime/`, { headers: { 'isAuth': 'false' }, withCredentials: true });
    }

    getAnimeWithQuery(type: string, search: string): Observable<Anime[]> {
        return this.http.get<Anime[]>(`${this.apiUrl}/anime/?${type}=${search}`, { headers: { 'isAuth': 'false' }, withCredentials: true });
    }

    setAnimes(animes: Anime[]): void {
        this._animes.set(animes);
    }

    getSpecificAnime(id: string): Observable<Anime> {
        return this.http.get<Anime>(`${this.apiUrl}/anime/${id}`, { headers: { 'isAuth': 'false' }, withCredentials: true });
    }

    postAnime(animeData: any): Observable<Anime> {
        return this.http.post<Anime>(`${this.apiUrl}/anime`, animeData, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    postReview(animeId: string, reviewData: any): Observable<Review> {
        return this.http.post<Review>(`${this.apiUrl}/review/${animeId}`, reviewData, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    getOwnerStatus(id: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/anime/${id}/status`, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    getReviewsForAnime(animeId: string): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.apiUrl}/review/anime/${animeId}`, { headers: { 'isAuth': 'false' }, withCredentials: true });
    }

    getReviewsForUser(userId: string): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.apiUrl}/review/user/${userId}`, { headers: { 'isAuth': 'false' }, withCredentials: true });
    }

    getSpecificReview(reviewId: string): Observable<Review> {
        return this.http.get<Review>(`${this.apiUrl}/review/${reviewId}`, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    getReviewedStatus(animeId: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/review/${animeId}/status`, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    editAnime(id: string, newData: any): Observable<Anime> {
        return this.http.put<Anime>(`${this.apiUrl}/anime/${id}`, newData, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    editReview(id: string, newData: any): Observable<Review> {
        return this.http.put<Review>(`${this.apiUrl}/review/${id}`, newData, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    deleteAnime(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/anime/${id}`, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    deleteReview(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/review/${id}`, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }
}
