import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/interfaces/user';

@Injectable({
    providedIn: 'root',
})
export class Auth {
    private apiUrl = 'http://localhost:1298/user';
    private _user = signal<any | null>(null);
    isAuthenticated = signal<boolean | null>(null);
    user = this._user.asReadonly();

    private getHeaders() {
        return new HttpHeaders({
            'X-Authorization': this.user()?.accessToken
        })
    }

    constructor(private http: HttpClient) { }

    register(authData: any): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/register`, authData);
    }

    login(authData: any): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/login`, authData);
    }

    setUser(userData: any): void {
        this._user.set(userData);
        this.isAuthenticated.set(true);
        localStorage.setItem('user', JSON.stringify(userData));
    }

    loadUser(): void {
        const user = localStorage.getItem('user');

        if (user) {
            this._user.set(JSON.parse(user));
            this.isAuthenticated.set(true);
        }
    }

    getUserData(id?: string) {
        return this.http.get<User>(`${this.apiUrl}/${id ? id : this.user()?._id}`, { headers: this.getHeaders(), withCredentials: true })
    }

    getToken() {
        const userData = localStorage.getItem('user');

        if (!userData) {
            return null;
        }

        return JSON.parse(userData).accessToken;
    }

    logout() {
        this.http.get(`${this.apiUrl}/logout`);
        this._user.set(null);
        this.isAuthenticated.set(false);
        localStorage.removeItem('user');
    }

    deleteUser(userId: string): Observable<void> {
        return this.http.delete <void>(`${this.apiUrl}/${userId}`, {headers: this.getHeaders(), withCredentials: true});
    }

    getAnimeList(userId?: string) {
        return this.http.get(`${this.apiUrl}/${userId ? userId : this.user()?._id}/list`, { headers: this.getHeaders(), withCredentials: true });
    }

    addAnimeToList(animeId: string) {
        return this.http.put(`${this.apiUrl}/${animeId}/watch`, {}, { headers: this.getHeaders(), withCredentials: true });
    }

    removeAnimeFromList(animeId: string) {
        return this.http.put(`${this.apiUrl}/${animeId}/remove`, {}, { headers: this.getHeaders(), withCredentials: true });
    }

    completeAnime(animeId: string) {
        return this.http.put(`${this.apiUrl}/${animeId}/complete`, {}, { headers: this.getHeaders(), withCredentials: true });
    }

    dropAnime(animeId: string) {
        return this.http.put(`${this.apiUrl}/${animeId}/drop`, {}, { headers: this.getHeaders(), withCredentials: true });
    }
}
