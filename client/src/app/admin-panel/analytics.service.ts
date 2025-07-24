import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalyticsData {
  userGrowth: {
    labels: string[];
    data: number[];
  };
  activeProjects: {
    active: number;
    total: number;
  };
  techStack: {
    labels: string[];
    data: number[];
  };
  userTypes: {
    developers: number;
    employers: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private baseUrl = 'http://localhost:3030/api';

  constructor(private http: HttpClient) {}

  getAnalyticsData(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${this.baseUrl}/analytics`);
  }

  getMockAnalyticsData(): AnalyticsData {
    return {
      userGrowth: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [10, 25, 40, 65, 85, 120]
      },
      activeProjects: {
        active: 45,
        total: 78
      },
      techStack: {
        labels: ['React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java'],
        data: [35, 28, 15, 42, 38, 25]
      },
      userTypes: {
        developers: 180,
        employers: 45
      }
    };
  }
}