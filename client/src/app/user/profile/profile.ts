import { Component, signal, computed, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { UserService } from '../user.service';
import { User } from '../../types/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CapitalizePipe],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  activeTab = signal<'first' | 'second'>('first');

  user: User | null = null;
  appliedProjects = signal<any[]>([]);
  savedProjects = signal<any[]>([]);
  postedProjects = signal<any[]>([]);
  savedDevelopers = signal<any[]>([]);

  userBio = signal<string>('');
  userLocation = signal<string>('');
  githubUrl = signal<string>('');
  linkedinUrl = signal<string>('');

  constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute) { }
  currentUser = computed(() => this.authService.getUser());
  isDeveloper = computed(() => this.currentUser()?.role === 'developer');
  isEmployer = computed(() => this.currentUser()?.role === 'employer');
  emailUrl = computed(() => `mailto:${this.currentUser()?.email || ''}`);

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    this.userService.getUserInfo(userId).subscribe((userInfo) => {
      console.log(userInfo);
      this.user = userInfo;
    });
  }

  getRoleDisplay(): string {
    const role = this.currentUser()?.role;
    if (role === 'developer') {
      return 'Developer';
    } else if (role === 'employer') {
      return 'Employer';
    }
    return 'User';
  }

  getFirstTabLabel(): string {
    return this.isDeveloper() ? 'Applied Projects' : 'Posted Projects';
  }

  getSecondTabLabel(): string {
    return this.isDeveloper() ? 'Saved Projects' : 'Saved Developers';
  }

  getFirstTabEmptyMessage(): string {
    return this.isDeveloper() ? 'No applied projects yet' : 'No posted projects yet';
  }

  getSecondTabEmptyMessage(): string {
    return this.isDeveloper() ? 'No saved projects yet' : 'No saved developers yet';
  }


  switchTab(tab: 'first' | 'second'): void {
    this.activeTab.set(tab);
  }
}