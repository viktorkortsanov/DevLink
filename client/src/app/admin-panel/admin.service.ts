import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../types/user';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ChatMessage } from './store/chat/chat.state';

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

  getAdminChatHistory(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${environment.apiUrl}/admin-chat`);
  }

  clearAdminChat(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/admin-chat`);
  }

  toggleAdminStatus(userId: string, makeAdmin: boolean): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/users/${userId}/admin-status`, {
      isAdmin: makeAdmin
    });
  }
}
