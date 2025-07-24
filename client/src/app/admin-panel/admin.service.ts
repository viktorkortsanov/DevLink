import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../types/user';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  updateUserInfo(id: string | null, userData: User) {
    return this.http.post<User>(`${environment.apiUrl}/adminpanel/${id}/edit-user`, userData, {
      withCredentials: true
    });
  };

  deleteUser(id: string | null) {
    return this.http.get(`${environment.apiUrl}/adminpanel/usermanagement/${id}/delete`);
  };

  getAdminChatHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/admin-chat`);
  }

  clearAdminChat(): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/admin-chat`);
  }
}
