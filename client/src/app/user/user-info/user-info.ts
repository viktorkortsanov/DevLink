import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { AuthService } from '../auth.service';
import { User } from '../../types/user';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CapitalizePipe, RouterLink],
  templateUrl: './user-info.html',
  styleUrls: ['./user-info.css']
})
export class UserInfoComponent implements OnInit {
  user = signal<User | null>(null);
  isLoading = signal<boolean>(true);
  userId: string | null = null;
  isSaved = signal<boolean>(false);
  currentUser = computed(() => this.authService.currentUser());
  userInfo: User | null = null;

  mockFeedbacks = [
    {
      _id: '1',
      rating: 5,
      comment: 'Excellent developer! Very professional and delivered high-quality work on time.',
      fromUser: {
        _id: '1',
        username: 'John Smith',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      rating: 4,
      comment: 'Great communication skills and solid technical knowledge. Would work with again.',
      fromUser: {
        _id: '2',
        username: 'Sarah Wilson',
        profileImage: ''
      },
      createdAt: '2024-01-10T14:20:00Z'
    },
    {
      _id: '3',
      rating: 5,
      comment: 'Outstanding work! Very creative solutions and attention to detail.',
      fromUser: {
        _id: '3',
        username: 'Mike Johnson',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      createdAt: '2024-01-05T09:15:00Z'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');

    const currentUserId = this.currentUser()?._id;
    if (!currentUserId) return;

    this.loadUserInfo();

    this.userService.getUserInfo(currentUserId).subscribe({
      next: (userInfo) => {
        this.userInfo = userInfo;

        if (this.userId) {
          const isDevSaved = userInfo?.savedDevelopers?.includes(this.userId);
          this.isSaved.set(!!isDevSaved);
        }
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      }
    });
  }

  loadUserInfo(): void {
    if (!this.userId) return;

    this.isLoading.set(true);

    this.userService.getUserInfo(this.userId).subscribe({
      next: (user) => {
        this.user.set(user);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading user info:', error);
        this.isLoading.set(false);
      }
    });
  }

  onSaveUser(): void {
    this.isSaved.set(!this.isSaved());
    if (!this.userId || !this.userInfo?._id) {
      console.warn('Missing userId or target user _id.');
      return;
    }

    this.userService.saveUser(this.userId, this.userInfo._id);
  }

  // Removed onGiveFeedback method - now using routerLink

  getAverageRating(): number {
    // Mock average rating за UI
    return 4.7;
  }

  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, index) => index < Math.floor(rating));
  }

  getInitials(username: string): string {
    return username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    const user = this.user();
    if (!user || !user.techStack) return [];

    return user.techStack
      .split(',')
      .map((tech: string) => tech.trim())
      .filter((tech: string) => tech.length > 0);
  }

  onTechIconError(event: any): void {
    event.target.style.display = 'none';
  }

  // Helper method to check if current user can give feedback
  get canGiveFeedback(): boolean {
    const currentUserId = this.currentUser()?._id;
    return !!currentUserId && currentUserId !== this.userId;
  }
}