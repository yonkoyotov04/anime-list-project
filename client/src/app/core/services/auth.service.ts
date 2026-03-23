import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/interfaces/user';

@Injectable({
    providedIn: 'root',
})
export class Auth {
    private apiUrl = 'http://localhost:1298';
    private _user = signal<any|null>(null);
    user = this._user.asReadonly();

    constructor(private http: HttpClient) {}

    register(authData: any): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/register`, authData);
    }

    login(authData: any): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/login`, authData);
    }
    
    setUser(userData: any) {
        this._user.set(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }

    loadUser() {
        const user = localStorage.getItem('user');

        if (user) {
            this._user.set(JSON.parse(user));
        }
    }

    logout() {
        this._user.set(null);
        localStorage.removeItem('user');
    }
}
