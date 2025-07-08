import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../types/user';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]>{
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getUserInfo(id: string | null) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  };

  updateUserInfo(id: string | null, userData: User) {
    return this.http.post<User>(`${environment.apiUrl}/edit-profile/${id}`, userData, {
      withCredentials: true
    });
  };

  starUser(id: string | null) {
    this.http.post(`${environment.apiUrl}/profile/${id}/star`, {}, {
      withCredentials: true
    }).subscribe({
      next: res => console.log('Star successful', res),
      error: err => console.error('Star failed:', err)
    });
  }
}
