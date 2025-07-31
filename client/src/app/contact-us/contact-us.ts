import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { AuthService } from '../user/auth.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-us.html',
  styleUrls: ['./contact-us.css']
})
export class ContactsComponent implements OnInit {
  contactForm = signal({
    email: '',
    subject: '',
    message: ''
  });

  isSubmitting = signal<boolean>(false);
  submitSuccess = signal<boolean>(false);
  submitError = signal<string>('');
  currentUser = computed(() => this.authService.currentUser());

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.currentUser();
    console.log(user);
    if (user?.email) {
      this.contactForm.update(form => ({
        ...form,
        email: user.email
      }));
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    this.isSubmitting.set(true);
    this.submitError.set('');

    const templateParams = {
      username: this.currentUser()?.username,
      email: this.contactForm().email,
      subject: this.contactForm().subject,
    };

    emailjs.send(
      'service_b98xzqr',
      'template_bvsfkrd',
      templateParams,
      'mxz5zqh2O_h0HA_5_'
    ).then(() => {
      this.submitSuccess.set(true);
      this.resetForm();
      this.isSubmitting.set(false);

      setTimeout(() => this.submitSuccess.set(false), 2000);
    }).catch((error) => {
      console.error('Email sending failed:', error);
      this.submitError.set('Failed to send message. Please try again.');
      this.isSubmitting.set(false);
    });
  }

  private validateForm(): boolean {
    const form = this.contactForm();

    if (!form.email || !form.subject || !form.message) {
      this.submitError.set('Please fill in all fields.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      this.submitError.set('Please enter a valid email address.');
      return false;
    }

    return true;
  }

  private resetForm(): void {
    this.contactForm.set({
      email: '',
      subject: '',
      message: ''
    });
  }

  updateForm(field: string, value: string): void {
    this.contactForm.update(form => ({
      ...form,
      [field]: value
    }));
  }
}