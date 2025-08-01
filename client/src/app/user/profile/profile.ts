import { Component, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { UserService } from '../user.service';
import { User } from '../../types/user';
import { ProjectService } from '../../projects/project.service';
import { ProjectCardComponent } from '../../projects/project-card/project-card';
import { DeveloperCardComponent } from '../../developers-container/developer-card/developer-card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CapitalizePipe, ProjectCardComponent, DeveloperCardComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  activeTab = signal<'first' | 'second'>('first');

  user: User | null = null;
  appliedProjects = signal<any[]>([]);
  savedProjects = signal<any[]>([]);
  postedProjects = signal<any[]>([]);
  savedDevelopers = signal<User[]>([]);

  isLoadingFirst = signal<boolean>(false);
  isLoadingSecond = signal<boolean>(false);

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) { }

  get isDeveloper(): boolean {
    return this.user?.role === 'developer';
  }

  get isEmployer(): boolean {
    return this.user?.role === 'employer';
  }

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

    if (this.isDeveloper) {
      const userId = this.user?._id;

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

    if (this.isDeveloper) {
      // Load saved projects for developer
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
      if (this.user?.savedDevelopers?.length) {
        this.userService.getAll().subscribe({
          next: (allUsers) => {
            const savedDevs = allUsers.filter(user => {
              return user && user.username && this.user?.savedDevelopers?.includes(user._id!);
            });
            this.savedDevelopers.set(savedDevs);
            this.isLoadingSecond.set(false);
          },
          error: (error) => {
            console.error('Error loading saved developers:', error);
            this.isLoadingSecond.set(false);
          }
        });
      } else {
        this.savedDevelopers.set([]);
        this.isLoadingSecond.set(false);
      }
    }
  }

  switchTab(tab: 'first' | 'second'): void {
    this.activeTab.set(tab);

    if (tab === 'second') {
      const userId = this.route.snapshot.paramMap.get('userId');

      if (this.isDeveloper && this.savedProjects().length === 0) {
        this.loadSecondTabData(userId);
      } else if (this.isEmployer && this.savedDevelopers().length === 0) {
        this.loadSecondTabData(userId);
      }
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
    return this.isDeveloper ? 'Applied Projects' : 'Posted Projects';
  }

  getSecondTabLabel(): string {
    return this.isDeveloper ? 'Saved Projects' : 'Saved Developers';
  }

  getFirstTabEmptyMessage(): string {
    return this.isDeveloper ? 'No applied projects yet' : 'No posted projects yet';
  }

  getSecondTabEmptyMessage(): string {
    return this.isDeveloper ? 'No saved projects yet' : 'No saved developers yet';
  }
}