import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../types/user';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-developer-card',
  imports: [],
  templateUrl: './developer-card.html',
  styleUrls: ['./developer-card.css']
})
export class DeveloperCardComponent implements OnInit {
  @Input() developerId?: string;
  @Input() developer?: User;

  ngOnInit(): void {
    if (this.developerId && !this.developer) {
      this.loadDeveloper();
    }
  }

  loadDeveloper(): void {
    if (this.developerId) {
      this.userService.getUserInfo(this.developerId).subscribe({
        next: (user) => {
          this.developer = user;
        },
        error: (error) => {
          console.error('Error loading developer:', error);
        }
      });
    }
  }

  constructor(private router: Router, private userService: UserService) { }

  getInitials(): string {
    if (!this.developer?.username) return 'U';

    return this.developer.username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getSkillsArray(): string[] {
    if (!this.developer?.techStack) return [];

    return this.developer.techStack
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .slice(0, 6);
  }

  onImageError(): void {
  }

  onLearnMore(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/profile', this.developer?._id, 'info']);
  }
}