import { Component, Input, Output, EventEmitter, OnInit, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserService } from '../../user/user.service';
import { User } from '../../types/user';

@Component({
  selector: 'app-applicants-dialog',
  imports: [CommonModule, RouterModule],
  templateUrl: './applicants-dialog.html',
  styleUrls: ['./applicants-dialog.css']
})
export class ApplicantsDialogComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() appliedUsers: string[] = [];

  @Output() close = new EventEmitter<void>();

  applicants = signal<User[]>([]);
  isLoading = signal<boolean>(false);

  constructor(private userService: UserService) { }

  ngOnInit(): void {    
  }

  ngOnChanges(): void {
    if (this.isVisible && this.appliedUsers.length > 0) {
      this.loadApplicants();
    } else if (this.appliedUsers.length === 0) {
      this.applicants.set([]);
    }
  }

  loadApplicants(): void {
    if (this.appliedUsers.length === 0) {
      this.applicants.set([]);
      return;
    }

    this.isLoading.set(true);

    const userRequests = this.appliedUsers.map(userId =>
      this.userService.getUserInfo(userId)
    );

    forkJoin(userRequests).subscribe({
      next: (users) => {
        this.applicants.set([...users]);
        console.log(this.applicants());
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading applicants:', error);
        this.isLoading.set(false);
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onOverlayClick(): void {
    this.onClose();
  }

  onContentClick(event: Event): void {
    event.stopPropagation();
  }

  getUserInitials(username: string): string {
    if (!username) return 'U';
    return username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  hasValidProfileImage(user: User): boolean {
    return !!(user?.profileImage && user.profileImage.trim() !== '');
  }
}