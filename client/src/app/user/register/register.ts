import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  errorMessage = signal<string>('');
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', [Validators.required]]
    });
  }

  onRegister(): void {
    this.errorMessage.set('');

    if (!this.registerForm.valid) {
      this.errorMessage.set('All fields are required');
      return;
    }

    const formValue = this.registerForm.value;

    if (formValue.password !== formValue.rePassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['/'])
      },
      error: (err) => this.errorMessage.set(err.error.err)
    });

  }
}