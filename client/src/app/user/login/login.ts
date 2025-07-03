import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  errorMessage = signal<string>('');
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    this.errorMessage.set('');

    if (!this.loginForm.valid) {
      this.errorMessage.set('All fields are required');
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['/']);
      },
      error: (err) => this.errorMessage.set(err.error.err)
    });
  }
}