import { Component, signal, computed, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../user/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header{
  isDropdownOpen = signal<boolean>(false);

  constructor(private authService: AuthService, private router: Router) {}
  isAuthenticated = computed(() => this.authService.isAuthenticated());
  userInfo = computed(() => this.authService.currentUser());
  
  toggleDropdown(): void {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  onLogout(event: Event): void {
    event.preventDefault();
    this.closeDropdown();
    this.authService.logout();
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.auth-section');
    
    if (!dropdown && this.isDropdownOpen()) {
      this.closeDropdown();
    }
  }
}