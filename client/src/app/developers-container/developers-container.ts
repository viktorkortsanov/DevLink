import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../types/user';
import { UserService } from '../user/user.service';
import { DeveloperCardComponent } from './developer-card/developer-card';

@Component({
  selector: 'app-developers-container',
  imports: [FormsModule, DeveloperCardComponent],
  templateUrl: './developers-container.html',
  styleUrls: ['./developers-container.css']
})
export class DevelopersContainerComponent implements OnInit {
  developers = signal<User[]>([]);
  filteredDevelopers = signal<User[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = 4;
  searchTerm = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadDevelopers();
  }

  loadDevelopers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService.getAll().subscribe({
      next: (users) => {
        const filteredDevelopers = users.filter(u => u.role === 'developer');
        this.developers.set(filteredDevelopers);
        this.filteredDevelopers.set(filteredDevelopers);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading developers:', error);
        this.errorMessage.set('Failed to load developers. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredDevelopers.set(this.developers());
    } else {
      const filtered = this.developers().filter(developer => {
        const nameMatch = developer.username?.toLowerCase().includes(term);
        const skillsMatch = developer.techStack?.toLowerCase().includes(term);
        const locationMatch = developer.location?.toLowerCase().includes(term);

        return nameMatch || skillsMatch || locationMatch;
      });

      this.filteredDevelopers.set(filtered);
    }

    this.currentPage.set(1);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredDevelopers.set(this.developers());
    this.currentPage.set(1);
  }

  getPaginatedDevelopers(): User[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredDevelopers().slice(start, end);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredDevelopers().length / this.pageSize);
  }

  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const current = this.currentPage();
    const delta = 2;

    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((v, i, a) => a.indexOf(v) === i && v > 0);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage.set(page);
    }
  }
}