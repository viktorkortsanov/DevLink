import { Component, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent {
  activeTab = signal<'login' | 'register'>('login');

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  currentSubtitle = computed(() => {
    return this.activeTab() === 'login' 
      ? 'Welcome back! Please sign in to your account'
      : 'Create your account and start your journey';
  });

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      console.log('Login attempt:', this.loginForm.value);
      // Тук ще добавиш логиката за логин
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      
      if (formValue.password !== formValue.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      console.log('Register attempt:', formValue);
      // Тук ще добавиш логиката за регистрация
    }
  }
}