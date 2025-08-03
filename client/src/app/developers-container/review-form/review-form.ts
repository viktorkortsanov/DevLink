import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../user/auth.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-form.html',
  styleUrls: ['./review-form.css']
})
export class ReviewFormComponent implements OnInit {
  currentUser = computed(() => this.authService.currentUser());
  targetUserId: string | null = null;

  rating = signal<number>(0);
  comment = signal<string>('');
  isSubmitting = signal<boolean>(false);

  readonly maxCommentLength = 500;
  readonly minCommentLength = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.targetUserId = this.route.snapshot.paramMap.get('userId');

    if (this.targetUserId === this.currentUser()?._id) {
      this.router.navigate(['/']);
    }
  }

  onRatingChange(newRating: number): void {
    this.rating.set(newRating);
  }

  onCommentChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.comment.set(target.value);
  }

  onSubmit(): void {
    if (!this.isValidForm()) {
      return;
    }

    this.isSubmitting.set(true);

    const reviewData = {
      owner: this.currentUser()?._id,
      content: this.comment().trim(),
      stars: this.rating()
    };

    const userId = this.currentUser()?._id;

    if (!this.targetUserId || !userId) {
      return;
    }

    this.userService.submitReview(this.targetUserId, userId, reviewData);
    this.isSubmitting.set(false);
    this.router.navigate(['/profile', this.targetUserId, 'info']);
  }

  onCancel(): void {
    this.router.navigate(['/profile', this.targetUserId, 'info']);
  }

  isValidForm(): boolean {
    return this.rating() > 0 &&
      this.comment().trim().length >= this.minCommentLength &&
      this.comment().trim().length <= this.maxCommentLength;
  }

  get commentLength(): number {
    return this.comment().length;
  }

  get isCommentValid(): boolean {
    return this.comment().trim().length >= this.minCommentLength;
  }

  get starArray(): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  getInitials(username: string): string {
    return username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}