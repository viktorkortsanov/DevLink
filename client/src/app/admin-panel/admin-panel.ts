import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { User } from '../types/user';
import { UserService } from '../user/user.service';
import { ConfirmDialogComponent } from '../dialog/dialog';
import { AdminService } from './admin.service';
import { ProjectService } from '../projects/project.service';
import { Project } from '../types/project';
import { AuthService } from '../user/auth.service';
import { SocketService } from './socket.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Store } from '@ngrx/store';
import { Observable, Subscription, take } from 'rxjs';
import * as ChatActions from './store/chat/chat.actions';
import * as ChatSelectors from './store/chat/chat.selectors';

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

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, ConfirmDialogComponent, BaseChartDirective],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.css']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  activeSection = signal<string>('users');
  currentUser = computed(() => this.authService.currentUser());
  private socketSubscriptions: Subscription[] = [];

  // User Management
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = signal<string>('');
  statusFilter = signal<string>('all');
  roleFilter = signal<string>('all');
  isLoadingUsers = signal<boolean>(false);
  showDeleteDialog = signal<boolean>(false);
  showDeleteUserDialog = signal<boolean>(false);
  userToDelete = signal<string | null>(null);
  projectToDelete = signal<string | null>(null);

  // Project Management
  projects = signal<Project[]>([]);
  filteredProjects = signal<Project[]>([]);
  projectSearchTerm = signal<string>('');
  isLoadingProjects = signal<boolean>(false);

  // Admin Chat - NgRx Integration
  chatMessages$!: Observable<any[]>;
  currentMessage$!: Observable<string>;
  isSending$!: Observable<boolean>;
  isLoadingChat$!: Observable<boolean>;
  isConnected$!: Observable<boolean>;
  chatError$!: Observable<string | null>;

  // Analytics
  analyticsData = signal<AnalyticsData | null>(null);
  isLoadingAnalytics = signal<boolean>(false);

  // Chart configurations
  userGrowthChart: ChartConfiguration<'line'> | null = null;
  techStackChart: ChartConfiguration<'bar'> | null = null;
  userTypesChart: ChartConfiguration<'doughnut'> | null = null;

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private socketService: SocketService,
    private store: Store
  ) {
    Chart.register(...registerables);

    // Initialize store selectors after injection
    this.chatMessages$ = this.store.select(ChatSelectors.selectChatMessages);
    this.currentMessage$ = this.store.select(ChatSelectors.selectCurrentMessage);
    this.isSending$ = this.store.select(ChatSelectors.selectIsSending);
    this.isLoadingChat$ = this.store.select(ChatSelectors.selectIsLoading);
    this.isConnected$ = this.store.select(ChatSelectors.selectIsConnected);
    this.chatError$ = this.store.select(ChatSelectors.selectChatError);
  }

  ngOnInit(): void {
    const currentFragment = this.route.snapshot.fragment;
    if (currentFragment) {
      this.onSectionChange(currentFragment);
    } else {
      this.loadUsers();
    }

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.onSectionChange(fragment);
      }
    });

    // Socket.io listeners integrated with NgRx
    const messageSubscription = this.socketService.listen('new-admin-message').subscribe((message) => {
      console.log('Received message from socket:', message); // debug log
      this.store.dispatch(ChatActions.messageReceived({ message }));
    });

    const connectSubscription = this.socketService.listen('connect').subscribe(() => {
      this.store.dispatch(ChatActions.socketConnected());
    });

    const disconnectSubscription = this.socketService.listen('disconnect').subscribe(() => {
      this.store.dispatch(ChatActions.socketDisconnected());
    });

    // Запази subscriptions за cleanup
    this.socketSubscriptions.push(messageSubscription, connectSubscription, disconnectSubscription);

    // Initialize connection status
    this.store.dispatch(ChatActions.socketConnected());
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
    this.socketSubscriptions.forEach(sub => sub.unsubscribe());
  }

  onSectionChange(section: string): void {
    this.activeSection.set(section);
    if (section === 'users') {
      this.loadUsers();
    } else if (section === 'projects') {
      this.loadProjects();
    } else if (section === 'chat') {
      this.loadChatHistory();
    } else if (section === 'analytics') {
      this.loadAnalytics();
    }
  }

  // User Management Methods (unchanged)
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
    this.showDeleteUserDialog.set(true);
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
    this.showDeleteUserDialog.set(false);
    this.userToDelete.set(null);
  }

  onToggleAdmin(userId: string, isCurrentlyAdmin: boolean): void {
    const action = isCurrentlyAdmin ? 'remove admin privileges from' : 'make admin';

    if (confirm(`Are you sure you want to ${action} this user?`)) {
      this.adminService.toggleAdminStatus(userId, !isCurrentlyAdmin).subscribe({
        next: () => {
          const userIndex = this.users.findIndex(u => u._id === userId);
          if (userIndex !== -1) {
            this.users[userIndex].isAdmin = !isCurrentlyAdmin;
            this.applyFilters();
          }

          const message = isCurrentlyAdmin ? 'Admin privileges removed' : 'User promoted to admin';
          console.log(message);
        },
        error: (error) => {
          console.error('Failed to toggle admin status:', error);
        }
      });
    }
  }

  // Project Management Methods (unchanged)
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

  // Admin Chat Methods - NgRx Integration
  loadChatHistory(): void {
    this.store.dispatch(ChatActions.loadChatHistory());

    // Load chat history via service (since no effects)
    this.adminService.getAdminChatHistory().subscribe({
      next: (messages) => {
        this.store.dispatch(ChatActions.loadChatHistorySuccess({ messages }));
      },
      error: (error) => {
        this.store.dispatch(ChatActions.loadChatHistoryFailure({ error: error.message }));
      }
    });
  }

  onMessageInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.store.dispatch(ChatActions.updateCurrentMessage({ message: target.value }));
  }

  sendMessage(): void {
    this.currentMessage$.pipe(take(1)).subscribe(message => {
      if (message.trim()) {
        const user = this.currentUser();

        if (!user || !user._id) {
          console.error('Missing user or user._id');
          return;
        }

        // Само socket emit - премахни NgRx dispatch-овете за изпращане
        this.socketService.emit('admin-message', {
          message: message.trim(),
          timestamp: new Date(),
          username: user.username,
          profileImage: user.profileImage || null,
          adminId: user._id
        });

        // Изчисти съобщението в store
        this.store.dispatch(ChatActions.updateCurrentMessage({ message: '' }));
      }
    });
  }

  onClearChat(): void {
    this.store.dispatch(ChatActions.clearChat());

    // Clear chat via service (since no effects)
    this.adminService.clearAdminChat().subscribe({
      next: () => {
        this.store.dispatch(ChatActions.clearChatSuccess());
        this.socketService.emit('chat-cleared', {});
      },
      error: (error) => {
        this.store.dispatch(ChatActions.loadChatHistoryFailure({ error: error.message }));
      }
    });
  }

  // Analytics Methods (unchanged)
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

  loadAnalytics(): void {
    this.isLoadingAnalytics.set(true);

    const mockData = this.getMockAnalyticsData();
    this.analyticsData.set(mockData);
    this.setupCharts(mockData);
    this.isLoadingAnalytics.set(false);
  }

  setupCharts(data: AnalyticsData): void {
    // User Growth Chart (Line)
    this.userGrowthChart = {
      type: 'line',
      data: {
        labels: data.userGrowth.labels,
        datasets: [{
          label: 'New Users',
          data: data.userGrowth.data,
          borderColor: '#0080ff',
          backgroundColor: 'rgba(0, 128, 255, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'User Growth Over Time'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    // Tech Stack Chart (Bar)
    this.techStackChart = {
      type: 'bar',
      data: {
        labels: data.techStack.labels,
        datasets: [{
          label: 'Projects',
          data: data.techStack.data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Popular Technologies'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    // User Types Chart (Doughnut)
    this.userTypesChart = {
      type: 'doughnut',
      data: {
        labels: ['Developers', 'Employers'],
        datasets: [{
          data: [data.userTypes.developers, data.userTypes.employers],
          backgroundColor: ['#36A2EB', '#FF6384']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'User Distribution'
          }
        }
      }
    };
  }

  getActiveProjectsPercentage(): number {
    const data = this.analyticsData();
    if (!data) return 0;
    return Math.round((data.activeProjects.active / data.activeProjects.total) * 100);
  }
}