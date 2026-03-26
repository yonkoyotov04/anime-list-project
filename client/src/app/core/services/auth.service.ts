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

    getUserData(id: string) {
        const headers = new HttpHeaders({
            'X-Authorization': this._user()?.accessToken
        })
        return this.http.get<User>(`${this.apiUrl}/${id}`, {headers, withCredentials: true})
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
}
