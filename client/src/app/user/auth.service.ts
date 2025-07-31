import { computed, Injectable, signal } from '@angular/core';
import { AuthResponse, LoginData, RegsiterData, User } from '../types/user';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { UserService } from './user.service';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = signal<boolean>(false);
  private _currentUser = signal<User | null>(null);

  currentUser = computed(() => this._currentUser());
  isAuthenticated = computed(() => this._isAuthenticated());

  constructor(private http: HttpClient, private userService: UserService) {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const user = this.getStoredUser();
    if (user) {
      this._currentUser.set(user);
      this._isAuthenticated.set(true);
    }
  }

  private getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    if (!user) {
      return null;
    }
    return JSON.parse(user);
  }

  updateUserProfile(updatedData: Partial<User>): void {
    const currentUser = this._currentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedData };
      this._currentUser.set(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }

  register(userData: RegsiterData) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/register`, userData, {
      withCredentials: true
    }).pipe(
      tap(async (res) => {
        const { _id, username, email, profileImage, role, isAdmin } = res.user;
        const user: User = { _id, username, email, profileImage, role, isAdmin };

        try {
          await emailjs.send(
            'service_b98xzqr',
            'template_6flqxas',
            { username, email },
            'mxz5zqh2O_h0HA_5_'
          );
        } catch (error) {
          console.warn('Failed to send welcome email:', error);
        }

        localStorage.setItem('user', JSON.stringify(user));
        this._currentUser.set(user);
        this._isAuthenticated.set(true);
      })
    );
  }

  login(userData: LoginData) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/login`, userData, {
      withCredentials: true
    }).pipe(
      tap((res) => {
        const { _id } = res.user;

        this.userService.getUserInfo(_id!).subscribe((userInfo) => {
          const user: User = {
            _id: userInfo._id,
            username: userInfo.username,
            email: userInfo.email,
            profileImage: userInfo.profileImage,
            role: userInfo.role,
            isAdmin: userInfo.isAdmin
          };

          localStorage.setItem('user', JSON.stringify(user));
          this._currentUser.set(user);
          this._isAuthenticated.set(true);
        });
      })
    );
  }


  logout(): void {
    localStorage.removeItem('user');
    this._currentUser.set(null);
    this._isAuthenticated.set(false);

    this.http.get(`${environment.apiUrl}/logout`, {
      withCredentials: true
    }).subscribe();
  }
}