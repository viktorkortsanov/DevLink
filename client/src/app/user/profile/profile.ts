import { Component, signal, computed, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { UserService } from '../user.service';
import { User } from '../../types/user';
import { ProjectService } from '../../projects/project.service';
import { ProjectCardComponent } from '../../projects/project-card/project-card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CapitalizePipe, ProjectCardComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  activeTab = signal<'first' | 'second'>('first');

  user: User | null = null;
  appliedProjects = signal<any[]>([]);
  savedProjects = signal<any[]>([]);
  postedProjects = signal<any[]>([]);

  isLoadingFirst = signal<boolean>(false);
  isLoadingSecond = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) { }

  currentUser = computed(() => this.authService.currentUser());
  isDeveloper = computed(() => this.currentUser()?.role === 'developer');
  isEmployer = computed(() => this.currentUser()?.role === 'employer');

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    this.loadUserInfo(userId);
    this.loadFirstTabData(userId);
  }

  loadUserInfo(userId: string | null): void {
    if (!userId) return;

    this.userService.getUserInfo(userId).subscribe({
      next: (userInfo) => {
        this.user = userInfo;
      },
      error: (error) => {
        console.error('Error loading user info:', error);
      }
    });
  }

  loadFirstTabData(userId: string | null): void {
    if (!userId) return;

    this.isLoadingFirst.set(true);

    if (this.isDeveloper()) {
      const userId = this.authService.currentUser()?._id;

      this.projectService.getAll().subscribe({
        next: (projects) => {
          if (!userId) return;

          const filtered = projects.filter(p => p.appliedUsers?.includes(userId));
          this.appliedProjects.set(filtered);
          this.isLoadingFirst.set(false);
        },
        error: (error) => {
          console.error('Error loading applied projects:', error);
          this.isLoadingFirst.set(false);
        }
      });
    } else {
      this.projectService.getAll().subscribe({
        next: (allProjects) => {
          const userProjects = allProjects.filter(project => project.owner === userId);
          this.postedProjects.set(userProjects);
          this.isLoadingFirst.set(false);
        },
        error: (error) => {
          console.error('Error loading posted projects:', error);
          this.isLoadingFirst.set(false);
        }
      });
    }
  }

  loadSecondTabData(userId: string | null): void {
    if (!userId || this.isLoadingSecond()) return;

    this.isLoadingSecond.set(true);

    if (this.isDeveloper()) {
      this.projectService.getAll().subscribe({
        next: (projects) => {
          const saved = projects.filter(p =>
            p._id && this.user?.savedProjects?.includes(p._id)
          );

          this.savedProjects.set(saved);
          this.isLoadingSecond.set(false);
        },
        error: (error) => {
          console.error('Error loading saved projects:', error);
          this.isLoadingSecond.set(false);
        }
      });

    } else {
      this.isLoadingSecond.set(false);
    }
  }

  switchTab(tab: 'first' | 'second'): void {
    this.activeTab.set(tab);

    if (tab === 'second' && this.isDeveloper() && this.savedProjects().length === 0) {
      const userId = this.route.snapshot.paramMap.get('userId');
      this.loadSecondTabData(userId);
    }
  }

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
    return this.isDeveloper() ? 'No saved projects yet' : 'Analytics coming soon';
  }
}