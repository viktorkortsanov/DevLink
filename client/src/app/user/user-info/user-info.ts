import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CapitalizePipe],
  templateUrl: './user-info.html',
  styleUrls: ['./user-info.css']
})
export class UserInfoComponent implements OnInit {
  user = signal<any>(null);
  isLoading = signal<boolean>(true);
  userId: string | null = null;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    if (!this.userId) return;

    this.isLoading.set(true);

    this.userService.getUserInfo(this.userId).subscribe({
      next: (user) => {
        console.log(user);
        this.user.set(user);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading user info:', error);
        this.isLoading.set(false);
      }
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
    if (!this.user()?.techStack) return [];
    return this.user().techStack
      .split(',')
      .map((tech: string) => tech.trim())
      .filter((tech: string) => tech.length > 0);
  }

  onTechIconError(event: any): void {
    event.target.style.display = 'none';
  }
}