import { Injectable, signal } from '@angular/core';
import { AuthResponse, LoginData, RegsiterData } from '../types/user';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = signal<boolean>(false);
  
  constructor(private http: HttpClient) {
    this._isAuthenticated.set(this.getUser() !== null);
  }

  getUser() {
    const user = localStorage.getItem('user');
    if (!user) {
      return null;
    }
    return JSON.parse(user);
  }

  isAuthenticated() {
    return this._isAuthenticated();
  }

  register(userData: RegsiterData) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/register`, userData, {
      withCredentials: true
    }).pipe(
      tap((res) => {
        const { _id, username, email, role, isAdmin } = res.user;
        localStorage.setItem('user', JSON.stringify({ _id, username, email, role, isAdmin }));
        this._isAuthenticated.set(true);
      })
    );
  }

  login(userData: LoginData) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/login`, userData, {
      withCredentials: true
    }).pipe(
      tap((res) => {
        const { _id, username, email, role, isAdmin } = res.user;
        localStorage.setItem('user', JSON.stringify({ _id, username, email, role, isAdmin }));
        this._isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this._isAuthenticated.set(false);
    
    this.http.get(`${environment.apiUrl}/logout`, {
      withCredentials: true
    }).subscribe();
  }
}