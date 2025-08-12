import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../user/auth.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css']
})
export class Feedback implements OnInit {
  currentUser = computed(() => this.authService.currentUser());

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

    if (!userId) {
      return;
    }

    this.userService.giveFeedback(reviewData)
    this.isSubmitting.set(false);
    this.router.navigate(['/feedbacks']);
  }

  onCancel(): void {
    this.router.navigate(['/']);
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