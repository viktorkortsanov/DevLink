import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

interface MentorshipForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  age: number | null;
  experience: string;
  company: string;
  position: string;
  motivation: string;
  privacyAccepted: boolean;
}

@Component({
  selector: 'app-mentorship',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mentors.html',
  styleUrls: ['./mentors.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('slideIn', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(300)
      ])
    ])
  ]
})
export class MentorshipComponent implements OnInit {
  applicationForm = signal<MentorshipForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    age: null,
    experience: '',
    company: '',
    position: '',
    motivation: '',
    privacyAccepted: false
  });

  showSuccessMessage = signal<boolean>(false);
  validationErrors = signal<{ [key: string]: string }>({});

  mentors = [
    {
      name: 'Tsveti Stoyanov',
      role: 'Lecturer at SoftUni & Software Engineer',
      company: 'Nuvolo Technologies Bulgaria',
      image: 'https://avatars.githubusercontent.com/u/21333675?v=4'
    },
    {
      name: 'Alexandrina Mehandzhiyska',
      role: 'Lecturer & Project Manager at SoftUni and Web Developer',
      company: 'Aim Academics',
      image: 'https://avatars.githubusercontent.com/u/73063309?v=4'
    },
    {
      name: 'Ivaylo Papazov',
      role: 'Lecturer at SoftUni & Tech Lead',
      company: 'FEIA Bulgaria',
      image: 'https://avatars.githubusercontent.com/u/6164175?v=4'
    },
  ];

  benefits = [
    {
      icon: '🎯',
      title: 'Personalized Learning Path',
      description: 'Get a customized learning roadmap tailored to your goals, current skills, and career aspirations. No generic advice - just what you need to succeed.',
      colorClass: 'goals'
    },
    {
      icon: '💡',
      title: 'Industry Insights',
      description: 'Learn about real-world challenges, best practices, and emerging technologies directly from professionals working at top tech companies.',
      colorClass: 'insights'
    },
    {
      icon: '🚀',
      title: 'Career Acceleration',
      description: 'Fast-track your career growth with strategic guidance on technical skills, soft skills, and navigating the tech industry landscape.',
      colorClass: 'career'
    }
  ];

  ngOnInit(): void {
    // Component initialization
  }

  scrollToForm(): void {
    const formElement = document.getElementById('application');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  updateForm(field: keyof MentorshipForm, value: any): void {
    this.applicationForm.update(form => ({
      ...form,
      [field]: value
    }));

    if (this.validationErrors()[field]) {
      this.validationErrors.update(errors => {
        const newErrors = { ...errors };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  validateForm(): boolean {
    const form = this.applicationForm();
    const errors: { [key: string]: string } = {};

    if (!form.firstName.trim()) errors['firstName'] = 'First name is required';
    if (!form.lastName.trim()) errors['lastName'] = 'Last name is required';
    if (!form.email.trim()) errors['email'] = 'Email is required';
    if (!form.phone.trim()) errors['phone'] = 'Phone number is required';
    if (!form.location.trim()) errors['location'] = 'Location is required';
    if (!form.age || form.age < 18 || form.age > 65) errors['age'] = 'Age must be between 18 and 65';
    if (!form.experience) errors['experience'] = 'Experience level is required';
    if (!form.company.trim()) errors['company'] = 'Company is required';
    if (!form.position.trim()) errors['position'] = 'Position is required';
    if (!form.motivation.trim()) errors['motivation'] = 'Goals and motivation is required';
    if (!form.privacyAccepted) errors['privacyAccepted'] = 'You must accept the privacy policy';

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors['email'] = 'Please enter a valid email address';
    }

    if (form.motivation && form.motivation.length < 50) {
      errors['motivation'] = 'Please provide at least 50 characters for your motivation';
    }

    this.validationErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.showSuccessMessage.set(true);

      this.resetForm();

      setTimeout(() => {
        this.showSuccessMessage.set(false);
      }, 5000);
    }
  }

  private resetForm(): void {
    this.applicationForm.set({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      age: null,
      experience: '',
      company: '',
      position: '',
      motivation: '',
      privacyAccepted: false
    });
  }

  hasError(field: string): boolean {
    return !!this.validationErrors()[field];
  }

  getError(field: string): string {
    return this.validationErrors()[field] || '';
  }
}