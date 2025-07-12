import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../types/user';
import { environment } from '../../environments/environment';

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
}
