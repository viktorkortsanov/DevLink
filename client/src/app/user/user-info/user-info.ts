import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { AuthService } from '../auth.service';
import { User, Review } from '../../types/user';

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

  // Removed mock data - using real reviews from user object

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
    const reviews = this.userReviews;
    if (reviews.length === 0) return 0;
    
    const totalStars = reviews.reduce((sum: number, review: Review) => sum + review.stars, 0);
    const average = totalStars / reviews.length;
    return Math.round(average * 10) / 10; // Round to 1 decimal place
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

  // Helper methods for reviews
  get userReviews(): Review[] {
    const reviews = this.user()?.reviews;
    return Array.isArray(reviews) ? reviews : [];
  }

  get hasReviews(): boolean {
    return this.userReviews.length > 0;
  }

  getOwnerInfo(review: Review): {username: string, profileImage?: string} | null {
    if (typeof review.owner === 'object' && review.owner !== null) {
      return review.owner;  // Populated данни
    }
    return null;  // Само ID - няма данни
  }

  // Helper method to check if current user can give feedback
  get canGiveFeedback(): boolean {
    const currentUserId = this.currentUser()?._id;
    return !!currentUserId && currentUserId !== this.userId;
  }
}