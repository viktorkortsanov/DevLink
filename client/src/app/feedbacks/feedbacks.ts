import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user/user.service';
import { FeedbackData } from '../types/user';

interface FeedbackItem {
  id: string;
  user: {
    name: string;
    profileImage?: string;
  };
  rating: number;
  message: string;
}

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedbacks.html',
  styleUrls: ['./feedbacks.css']
})
export class FeedbacksComponent implements OnInit {
  feedbackList = signal<FeedbackData[]>([]);
  currentPage = signal<number>(1);
  itemsPerPage = 5;
  isLoading = signal<boolean>(false);

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadFeedback();
  }

  loadFeedback(): void {
    this.isLoading.set(true);

    this.userService.getFeedbacks().subscribe({
      next: (feedback) => {
        this.feedbackList.set(feedback);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading feedback:', error);
        this.isLoading.set(false);
      }
    });
  }

  get paginatedFeedback(): FeedbackData[] {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.feedbackList().slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.feedbackList().length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    const current = this.currentPage();
    const total = this.totalPages;
    const startPage = Math.max(1, current - 2);
    const endPage = Math.min(total, current + 2);

    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(direction: 'prev' | 'next'): void {
    const current = this.currentPage();
    const total = this.totalPages;

    if (direction === 'prev' && current > 1) {
      this.currentPage.set(current - 1);
    } else if (direction === 'next' && current < total) {
      this.currentPage.set(current + 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
    }
  }

  getOwnerInfo(feedback: FeedbackData): { username: string, profileImage?: string } | null {
    if (typeof feedback.owner === 'object' && feedback.owner !== null) {
      return feedback.owner;
    }
    return null;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, index) => index < rating);
  }
}