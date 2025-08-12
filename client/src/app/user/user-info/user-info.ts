import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { AuthService } from '../auth.service';
import { User, Review } from '../../types/user';
import { GitHubService } from '../github.service';

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
  topRepos = signal<any>(null);
  isLoadingGithub = signal<boolean>(false);

  displayedReviews = signal<Review[]>([]);
  reviewsPerPage = 3;
  currentPage = signal<number>(0);
  isLoadingMore = signal<boolean>(false);
  hasMoreReviews = signal<boolean>(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private githubService: GitHubService
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
        this.initializeReviews();
        this.isLoading.set(false);
        this.loadTopRepositories();
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

  getAverageRating(): number {
    const reviews = this.userReviews;
    if (reviews.length === 0) return 0;

    const totalStars = reviews.reduce((sum: number, review: Review) => sum + review.stars, 0);
    const average = totalStars / reviews.length;
    return Math.round(average * 10) / 10;
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

  get userReviews(): Review[] {
    const reviews = this.user()?.reviews;
    return Array.isArray(reviews) ? reviews : [];
  }

  get hasReviews(): boolean {
    return this.userReviews.length > 0;
  }

  initializeReviews(): void {
    const reviews = this.userReviews;
    this.currentPage.set(0);
    this.displayedReviews.set(reviews.slice(0, this.reviewsPerPage));
    this.hasMoreReviews.set(reviews.length > this.reviewsPerPage);
  }

  loadMoreReviews(): void {
    if (this.isLoadingMore() || !this.hasMoreReviews()) return;

    this.isLoadingMore.set(true);

    setTimeout(() => {
      const allReviews = this.userReviews;
      const nextPage = this.currentPage() + 1;
      const startIndex = nextPage * this.reviewsPerPage;
      const endIndex = startIndex + this.reviewsPerPage;

      const newReviews = allReviews.slice(startIndex, endIndex);

      if (newReviews.length > 0) {
        const currentDisplayed = this.displayedReviews();
        this.displayedReviews.set([...currentDisplayed, ...newReviews]);
        this.currentPage.set(nextPage);
      }

      this.hasMoreReviews.set(endIndex < allReviews.length);
      this.isLoadingMore.set(false);
    }, 500);
  }

  onScrollEnd(): void {
    this.loadMoreReviews();
  }

  getOwnerInfo(review: Review): { username: string, profileImage?: string } | null {
    if (typeof review.owner === 'object' && review.owner !== null) {
      return review.owner;
    }
    return null;
  }

  get canGiveFeedback(): boolean {
    const currentUserId = this.currentUser()?._id;
    return !!currentUserId && currentUserId !== this.userId;
  }

  loadTopRepositories(): void {
    const user = this.user();

    if (!user?.githubLink) {
      console.log('No GitHub link found');
      return;
    }

    this.isLoadingGithub.set(true);

    this.githubService.getTopRepositories(user.githubLink).subscribe({
      next: (repos) => {
        this.topRepos.set(repos);
        this.isLoadingGithub.set(false);
      },
      error: (error) => {
        console.log('GitHub API error:', error);
        this.isLoadingGithub.set(false);
      }
    });
  }
}