import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../types/project';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Project[]>{
    return this.http.get<Project[]>(`${environment.apiUrl}/projects`);
  }

  create(projectData: Project): Observable<Project> {
    return this.http.post<Project>(`${environment.apiUrl}/create-project`, projectData, {
      withCredentials: true,
    });
  }

}
