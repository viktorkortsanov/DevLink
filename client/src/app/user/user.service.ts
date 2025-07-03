import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EdidUserData, User } from '../types/user';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserInfo(id: string | null) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  updateUserInfo(id: string | null, userData: User) {
    return this.http.post<User>(`${environment.apiUrl}/edit-profile/${id}`, userData, {
      withCredentials: true
    }).pipe(
      tap((res) => {
        const { _id, username, email, role, isAdmin } = res;
        localStorage.setItem('user', JSON.stringify({ _id, username, email, role, isAdmin }));
      })
    );
  }
}
