import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  errorMessage = signal<string>('');
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onRegister(): void {
    this.errorMessage.set('');

    if (!this.registerForm.valid) {
      this.errorMessage.set('All fields are required');
      return;
    }

    const formValue = this.registerForm.value;
    
    if (formValue.password !== formValue.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    console.log('Register attempt with POST method:', formValue.email);
    // Тук ще добавиш HTTP POST заявката за регистрация
  }
}