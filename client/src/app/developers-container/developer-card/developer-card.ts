import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../types/user';

@Component({
  selector: 'app-developer-card',
  imports: [],
  templateUrl: './developer-card.html',
  styleUrls: ['./developer-card.css']
})
export class DeveloperCardComponent {
  @Input() developer!: User;

  constructor(private router: Router) {}

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
    this.router.navigate(['/profile', this.developer._id, 'info']);
  }
}