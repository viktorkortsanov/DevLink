import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { User } from '../types/user';
import { UserService } from '../user/user.service';
import { ConfirmDialogComponent } from '../dialog/dialog';
import { AdminService } from './admin.service';
import { ProjectService } from '../projects/project.service';
import { Project } from '../types/project';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, ConfirmDialogComponent],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.css']
})
export class AdminPanelComponent implements OnInit {
  activeSection = signal<string>('dashboard');

  // User Management
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = signal<string>('');
  statusFilter = signal<string>('all');
  roleFilter = signal<string>('all');
  isLoadingUsers = signal<boolean>(false);
  showDeleteDialog = signal<boolean>(false);
  userToDelete = signal<string | null>(null);
  projectToDelete = signal<string | null>(null);

  // Project Management
  projects = signal<Project[]>([]);
  filteredProjects = signal<Project[]>([]);
  projectSearchTerm = signal<string>('');
  isLoadingProjects = signal<boolean>(false);

  constructor(private userService: UserService, private adminService: AdminService, private projectService: ProjectService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const currentFragment = this.route.snapshot.fragment;
    if (currentFragment) {
      this.onSectionChange(currentFragment);
    }

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.onSectionChange(fragment);
      }
    });
  }

  onSectionChange(section: string): void {
    this.activeSection.set(section);
    if (section === 'users') {
      this.loadUsers();
    } else if (section === 'projects') {
      this.loadProjects();
    }
  }

  loadUsers(): void {
    this.isLoadingUsers.set(true);
    this.userService.getAll().subscribe({
      next: (users) => {
        if (!users) return;

        this.users = users;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Failed to load users:', error);
      },
      complete: () => {
        this.isLoadingUsers.set(false);
      }
    });
  }


  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.applyFilters();
  }

  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.statusFilter.set(target.value);
    this.applyFilters();
  }

  onRoleFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.roleFilter.set(target.value);
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.users;

    if (this.searchTerm()) {
      const search = this.searchTerm().toLowerCase();
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    if (this.statusFilter() !== 'all') {
      if (this.statusFilter() === 'ADMIN') {
        filtered = filtered.filter(user => user.isAdmin === true);
      } else if (this.statusFilter() === 'USER') {
        filtered = filtered.filter(user => user.isAdmin === false);
      }
    }

    if (this.roleFilter() !== 'all') {
      filtered = filtered.filter(user => user.role === this.roleFilter().toLocaleLowerCase());
    }

    this.filteredUsers = filtered;
  }

  getUserInitials(username: string): string {
    return username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  onDeleteUser(userId: string): void {
    this.userToDelete.set(userId);
    this.showDeleteDialog.set(true);
  }

  onConfirmDelete(): void {
    const userId = this.userToDelete();
    if (userId) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          const updatedUsers = this.users.filter(user => user._id !== userId);
          this.users = updatedUsers;
          this.applyFilters();
        },
        error: (err) => console.error('Failed to delete user:', err)
      });
    }
    this.showDeleteDialog.set(false);
    this.userToDelete.set(null);
  }

  onCancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.userToDelete.set(null);
  }

  ////// Project Management

  loadProjects(): void {
    this.isLoadingProjects.set(true);
    this.projectService.getAll().subscribe({
      next: (projects) => {
        if (!projects) return;

        this.projects.set(projects);
        this.applyProjectFilters();
      },
      error: (error) => {
        console.error('Failed to load projects:', error);
      },
      complete: () => {
        this.isLoadingProjects.set(false);
      }
    });
  }

  onProjectSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.projectSearchTerm.set(target.value);
    this.applyProjectFilters();
  }

  applyProjectFilters(): void {
    let filtered = this.projects();

    if (this.projectSearchTerm()) {
      const search = this.projectSearchTerm().toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(search) ||
        (typeof project.owner === 'object' && project.owner?.username?.toLowerCase().includes(search))
      );
    }

    this.filteredProjects.set(filtered);
  }
  getProjectInitials(title: string): string {
    return title
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  onDeleteProject(projectId: string): void {
    this.projectToDelete.set(projectId);
    this.showDeleteDialog.set(true);
  }

  onCancelDeleteProject(): void {
    this.showDeleteDialog.set(false);
  }

  onConfirmDeleteProject(): void {
    const projectId = this.projectToDelete();
    if (projectId) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          const updatedProjects = this.projects().filter(project => project._id !== projectId);
          this.projects.set(updatedProjects);
          this.applyProjectFilters();
        },
        error: (err) => console.error('Failed to delete project:', err)
      });
    }
    this.showDeleteDialog.set(false);
    this.projectToDelete.set(null);
  }

  onFeatureProject(): void {
    // TODO: Feature/unfeature project
  }

  onExportReport(): void {
    // TODO: Export analytics report
  }

  onMarkAllRead(): void {
    // TODO: Mark all chat messages as read
  }
}