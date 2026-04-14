import { HttpClient} from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/interfaces/user';
import { ListItem } from '../../shared/interfaces/list-item';

@Injectable({
    providedIn: 'root',
})
export class Auth {
    private apiUrl = 'http://localhost:1298/user';
    private _user = signal<any | null>(null);
    isAuthenticated = signal<boolean | null>(null);
    user = this._user.asReadonly();

    constructor(private http: HttpClient) { }

    register(authData: any): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/register`, authData, { withCredentials: true });
    }

    login(authData: any): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/login`, authData, { withCredentials: true });
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

    getUserData(id?: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id ? id : this.user()?._id}`, { headers: { 'isAuth': 'false' }, withCredentials: true })
    }

    getToken() {
        const userData = localStorage.getItem('user');

        if (!userData) {
            return null;
        }

        return JSON.parse(userData).accessToken;
    }

    refreshToken(): Observable<string> {
        return this.http.get<string>(`${this.apiUrl}/refresh`, { withCredentials: true })
    }

    logout(): Observable<void> {
        return this.http.get<void>(`${this.apiUrl}/logout`, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    afterLogout(): void {
        this._user.set(null);
        this.isAuthenticated.set(false);
        localStorage.removeItem('user');
    }

    editUser(newData: any): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${this.user()?._id}`, newData, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    changePassword(newPasswordData: any): Observable<void> {
        return this.http.put<void>(
            `${this.apiUrl}/password/${this.user()?._id}`,
            newPasswordData,
            { headers: { 'isAuth': 'true' }, withCredentials: true })
    }

    deleteUser(userId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${userId}`, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    getAnimeList(userId?: string): Observable<ListItem[]> {
        return this.http.get<ListItem[]>(`${this.apiUrl}/${userId ? userId : this.user()?._id}/list`,
            { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    addAnimeToList(animeId: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${animeId}/watch`, {}, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    removeAnimeFromList(animeId: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${animeId}/remove`, {}, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    completeAnime(animeId: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${animeId}/complete`, {}, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }

    dropAnime(animeId: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${animeId}/drop`, {}, { headers: { 'isAuth': 'true' }, withCredentials: true });
    }
}
