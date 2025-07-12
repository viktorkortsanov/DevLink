import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, RouterLink, RouterModule } from '@angular/router';
import { User } from '../types/user';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
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

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Check fragment immediately
    const currentFragment = this.route.snapshot.fragment;
    if (currentFragment) {
      this.onSectionChange(currentFragment);
    }

    // Also subscribe for future changes
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

    // Search filter
    if (this.searchTerm()) {
      const search = this.searchTerm().toLowerCase();
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    // Status filter (boolean)
    if (this.statusFilter() !== 'all') {
      if (this.statusFilter() === 'ADMIN') {
        filtered = filtered.filter(user => user.isAdmin === true);
      } else if (this.statusFilter() === 'USER') {
        filtered = filtered.filter(user => user.isAdmin === false);
      }
    }

    // Role filter
    if (this.roleFilter() !== 'all') {
      filtered = filtered.filter(user => user.role === this.roleFilter().toLocaleLowerCase());
    }

    this.filteredUsers = filtered;
  }

  onEditUser(userId: string): void {
    // TODO: Open edit user modal/form
    console.log('Edit user:', userId);
  }

  // Helper method to get user initials
  getUserInitials(username: string): string {
    return username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  onDeleteUser(userId: string): void {
    // TODO: Confirm and delete user
    console.log('Delete user:', userId);
  }

  // TODO: Implement these methods
  onAddUser(): void {
    // TODO: Open add user modal/form
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