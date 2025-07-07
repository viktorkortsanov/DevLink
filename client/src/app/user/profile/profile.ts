import { Component, signal, computed, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { UserService } from '../user.service';
import { User } from '../../types/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CapitalizePipe],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  activeTab = signal<'first' | 'second'>('first');

  user: User | null = null;
  appliedProjects = signal<any[]>([]);
  savedProjects = signal<any[]>([]);
  postedProjects = signal<any[]>([]);
  savedDevelopers = signal<any[]>([]);

  userBio = signal<string>('');
  userLocation = signal<string>('');
  githubUrl = signal<string>('');
  linkedinUrl = signal<string>('');

  constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute) { }
  currentUser = computed(() => this.authService.currentUser());
  isDeveloper = computed(() => this.currentUser()?.role === 'developer');
  isEmployer = computed(() => this.currentUser()?.role === 'employer');
  emailUrl = computed(() => `mailto:${this.currentUser()?.email || ''}`);

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    this.userService.getUserInfo(userId).subscribe((userInfo) => {
      this.user = userInfo;
    });
  }

  getRoleDisplay(): string {
    const role = this.currentUser()?.role;
    if (role === 'developer') {
      return 'Developer';
    } else if (role === 'employer') {
      return 'Employer';
    }
    return 'User';
  };

  generateTechIcon(tech: string): string {
    const normalizedTech = tech.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/js$/, 'javascript')
      .replace(/ts$/, 'typescript')
      .replace(/nodejs/, 'nodejs')
      .replace(/reactjs/, 'react')
      .replace(/vuejs/, 'vuejs')
      .replace(/angularjs/, 'angularjs')
      .replace(/html/, 'html5')
      .replace(/css/, 'css3');

    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${normalizedTech}/${normalizedTech}-original.svg`;
  }

  get techStackArray(): string[] {
    if (!this.user?.techStack) return [];
    return this.user.techStack
      .split(',')
      .map((tech: string) => tech.trim())
      .filter((tech: string) => tech.length > 0);
  }

  onTechIconError(event: any): void {
    event.target.style.display = 'none';
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