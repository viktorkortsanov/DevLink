import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  private readonly API_URL = 'https://api.github.com';

  constructor(private http: HttpClient) { }

  getTopRepositories(githubLink: string): Observable<any> {
    if (!githubLink) return of(null);

    const username = this.extractUsername(githubLink);

    return this.http.get<any[]>(`${this.API_URL}/users/${username}/repos?per_page=30`)
      .pipe(
        map((repos: any[]) => {
          return repos
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 3);
        }),
        catchError(() => of(null))
      );
  }

  private extractUsername(githubLink: string): string {
    if (githubLink.includes('github.com/')) {
      return githubLink.split('github.com/')[1].split('/')[0];
    }
    return githubLink;
  }
}