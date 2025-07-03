import { Component, signal, computed } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  activeTab = signal<'first' | 'second'>('first');

  appliedProjects = signal<any[]>([]);
  savedProjects = signal<any[]>([]);
  postedProjects = signal<any[]>([]);
  savedDevelopers = signal<any[]>([]);

  userBio = signal<string>('');
  userLocation = signal<string>('');
  githubUrl = signal<string>('');
  linkedinUrl = signal<string>('');

  constructor(private authService: AuthService) { }

  currentUser = computed(() => this.authService.getUser());
  isDeveloper = computed(() => this.currentUser()?.role === 'developer');
  isEmployer = computed(() => this.currentUser()?.role === 'employer');
  emailUrl = computed(() => `mailto:${this.currentUser()?.email || ''}`);

  getRoleDisplay(): string {
    const role = this.currentUser()?.role;
    if (role === 'developer') {
      return 'Developer';
    } else if (role === 'employer') {
      return 'Employer';
    }
    return 'User';
  }

  getFirstTabLabel(): string {
    return this.isDeveloper() ? 'Applied Projects' : 'Posted Projects';
  }

  getSecondTabLabel(): string {
    return this.isDeveloper() ? 'Saved Projects' : 'Saved Developers';
  }

  getFirstTabEmptyMessage(): string {
    return this.isDeveloper() ? 'No applied projects yet' : 'No posted projects yet';
  }

  getSecondTabEmptyMessage(): string {
    return this.isDeveloper() ? 'No saved projects yet' : 'No saved developers yet';
  }


  switchTab(tab: 'first' | 'second'): void {
    this.activeTab.set(tab);
  }
}