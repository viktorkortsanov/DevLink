import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Project } from '../../types/project';
import { ProjectService } from '../project.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../user/auth.service';
import { ConfirmDialogComponent } from '../../dialog/dialog';
import { ApplicantsDialogComponent } from '../applicants-dialog/applicants-dialog';
import { User } from '../../types/user';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-project-details',
  imports: [CommonModule, RouterLink, ConfirmDialogComponent, ApplicantsDialogComponent],
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.css']
})
export class ProjectDetailsComponent implements OnInit {
  project: Project | null = null;
  user: User | null = null;
  isLoading = signal<boolean>(true);
  logoError = signal<boolean>(false);
  currentUser = computed(() => this.authService.currentUser());
  showDeleteDialog = signal<boolean>(false);
  isApplied = signal<boolean>(false);
  isSaved = signal<boolean>(false);
  showApplicantsDialog = signal<boolean>(false);

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    const userId = this.currentUser()?._id;
    if (!userId) return;

    this.userService.getUserInfo(userId).subscribe({
      next: (userInfo) => {
        this.user = userInfo;
        this.loadProjectDetails();
      },
      error: (err) => console.error(err)
    });
  }



  loadProjectDetails(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    if (!projectId) {
      console.error('Missing projectId from route');
      this.isLoading.set(false);
      return;
    }

    this.projectService.getDetails(projectId).subscribe({
      next: (p) => {
        this.project = p;
        const userId = this.currentUser()?._id;
        this.isApplied.set(!!(userId && this.project.appliedUsers?.includes(userId)));
        this.isSaved.set(!!this.user?.savedProjects?.includes(projectId));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading project details:', err);
        this.isLoading.set(false);
      }
    });
  }


  get requirementsList(): string[] {
    return this.project?.requirements
      ?.split('\n')
      .map(req => req.trim())
      .filter(req => req.length > 0) || [];
  }

  get techStackArray(): string[] {
    return this.project?.techStack
      ?.split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0) || [];
  }

  get workTypeConfig() {
    const configs = {
      remote: {
        label: 'Remote',
        class: 'remote',
        icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0z M8 21v-4a2 2 0 012-2h2a2 2 0 012 2v4 M9 13h6'
      },
      hybrid: {
        label: 'Hybrid',
        class: 'hybrid',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
      },
      office: {
        label: 'Office',
        class: 'office',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
      }
    };
    return configs[this.project?.workType || 'office'];
  }

  get experienceLevelLabel(): string {
    const levels: Record<string, string> = {
      junior: 'Junior / Intern',
      mid: 'Mid',
      senior: 'Senior'
    };
    return levels[this.project?.experienceLevel || ''] || 'Not specified';
  }

  get projectTypeLabel(): string {
    const types: Record<string, string> = {
      'front-end': 'Frontend Development',
      'back-end': 'Backend Development',
      'full-stack': 'Full-Stack Development',
      'mobile': 'Mobile Development',
      'ui-ux': 'UI/UX Design',
      'devops': 'DevOps'
    };
    return types[this.project?.projectType || ''] || 'Development';
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

  onTechIconError(event: any): void {
    event.target.style.display = 'none';
  }

  onLogoError(): void {
    this.logoError.set(true);
  }

  onSaveToggle(): void {
    this.isSaved.set(!this.isSaved());
    this.projectService.saveProject(this.project?._id, this.currentUser()?._id).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Грешка при save:', err);
      }
    });
  }

  onDelete(): void {
    this.showDeleteDialog.set(true);
  }

  onCloseDeleteDialog(): void {
    this.showDeleteDialog.set(false);
  }

  onViewApplicants(): void {
    this.showApplicantsDialog.set(true);
  }

  onCloseApplicantsDialog(): void {
    this.showApplicantsDialog.set(false);
  }



  onApply(): void {
    const userId = this.currentUser()?._id;
    const projectId = this.project?._id;
    this.projectService.applyProject(projectId, userId).subscribe({
      next: () => {
        this.isApplied.set(true);
      },
      error: (err) => {
        console.error('Грешка при кандидатстване:', err);
      }
    });
  }

  hasValidLogo(): boolean {
    return !!(this.project?.projectLogo && !this.logoError());
  }
}
