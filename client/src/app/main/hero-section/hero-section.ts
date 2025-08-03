import { Component, computed } from '@angular/core';
import { AuthService } from '../../user/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css'
})
export class HeroSection {
  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor(private authService: AuthService) { }
}
