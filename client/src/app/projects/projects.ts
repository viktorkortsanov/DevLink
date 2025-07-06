import { Component, signal, computed, OnInit } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { RouterLink } from '@angular/router';
import { ProjectService } from './project.service';
import { ProjectCardComponent } from './project-card/project-card';

@Component({
  selector: 'app-projects-container',
  imports: [RouterLink, ProjectCardComponent],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class ProjectsContainerComponent implements OnInit {
  allProjects = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(1);
  projectTypeFilter = signal<string>('');
  levelFilter = signal<string>('');
  workTypeFilter = signal<string>('');

  projectsPerPage = 3;

  constructor(private authService: AuthService, private projectService: ProjectService) { }

  currentUser = computed(() => this.authService.currentUser());
  isDeveloper = computed(() => this.currentUser()?.role === 'developer');
  isEmployer = computed(() => this.currentUser()?.role === 'employer');

  ngOnInit(): void {
    this.loadProjects();
  }

  filteredProjects = computed(() => {
    let projects = this.allProjects();

    if (this.projectTypeFilter()) {
      projects = projects.filter(project =>
        project.projectType && project.projectType.toLowerCase() === this.projectTypeFilter().toLowerCase()
      );
    }

    if (this.levelFilter()) {
      projects = projects.filter(project =>
        project.experienceLevel && project.experienceLevel.toLowerCase() === this.levelFilter().toLowerCase()
      );
    }

    if (this.workTypeFilter()) {
      projects = projects.filter(project =>
        project.workType && project.workType.toLowerCase() === this.workTypeFilter().toLowerCase()
      );
    }

    return projects;
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredProjects().length / this.projectsPerPage)
  );

  paginatedProjects = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.projectsPerPage;
    const endIndex = startIndex + this.projectsPerPage;
    return this.filteredProjects().slice(startIndex, endIndex);
  });

  loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.allProjects.set(projects);
      },
      error: (err) => console.error('Грешка при зареждане на проекти:', err)
    });
  }

  onFilterChange(filterType: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    switch (filterType) {
      case 'projectType':
        this.projectTypeFilter.set(value);
        break;
      case 'level':
        this.levelFilter.set(value);
        break;
      case 'workType':
        this.workTypeFilter.set(value);
        break;
    }

    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.projectTypeFilter.set('');
    this.levelFilter.set('');
    this.workTypeFilter.set('');
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getVisiblePages(): (number | string)[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) {
        pages.push('...');
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== total) {
          pages.push(i);
        }
      }

      if (current < total - 2) {
        pages.push('...');
      }

      if (total > 1) {
        pages.push(total);
      }
    }

    return pages;
  }
}