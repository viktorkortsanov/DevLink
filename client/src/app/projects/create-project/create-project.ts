import { Component, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-project.html',
  styleUrls: ['./create-project.css']
})
export class CreateProjectComponent implements OnInit {
  projectForm: FormGroup;
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  logoPreviewUrl = signal<string>('');

  projectTypes = [
    { value: 'front-end', label: 'Front-End' },
    { value: 'back-end', label: 'Back-End' },
    { value: 'full-stack', label: 'Full-Stack' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'ui-ux', label: 'UI/UX Designer' },
    { value: 'devops', label: 'DevOps' }
  ];

  experienceLevels = [
    { value: 'junior', label: 'Junior / Intern' },
    { value: 'mid', label: 'Mid' },
    { value: 'senior', label: 'Senior' }
  ];

  workTypes = [
    { value: 'office', label: 'Office' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'remote', label: 'Fully Remote' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
  ) {
    this.projectForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      projectLogo: [''],
      shortDescription: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]],
      fullDescription: ['', [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(2000)
      ]],
      requirements: ['', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(1000)
      ]],
      projectType: ['', [Validators.required]],
      experienceLevel: ['', [Validators.required]],
      workType: ['', [Validators.required]],
      techStack: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200)
      ]]
    });
  }

  ngOnInit(): void {
  }

  onLogoUrlChange(): void {
    const logoUrl = this.projectForm.get('projectLogo')?.value;
    if (logoUrl && this.isValidImageUrl(logoUrl)) {
      this.logoPreviewUrl.set(logoUrl);
    } else {
      this.logoPreviewUrl.set('');
    }
  }

  onLogoError(): void {
    this.logoPreviewUrl.set('');
  }

  getLogoFilename(): string {
    const logoUrl = this.projectForm.get('projectLogo')?.value;
    if (logoUrl && this.logoPreviewUrl()) {
      const filename = logoUrl.substring(logoUrl.lastIndexOf('/') + 1);
      return `Preview: ${filename}`;
    }
    return 'No logo uploaded';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;
    const fieldLabels: { [key: string]: string } = {
      title: 'Project title',
      shortDescription: 'Short description',
      fullDescription: 'Full description',
      requirements: 'Requirements',
      projectType: 'Project type',
      experienceLevel: 'Experience level',
      workType: 'Work type',
      techStack: 'Tech stack'
    };

    const label = fieldLabels[fieldName] || fieldName;

    if (errors['required']) return `${label} is required`;
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      const actualLength = errors['minlength'].actualLength;
      return `${label} must be at least ${requiredLength} characters (current: ${actualLength})`;
    }
    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      const actualLength = errors['maxlength'].actualLength;
      return `${label} cannot exceed ${requiredLength} characters (current: ${actualLength})`;
    }

    return 'Invalid input';
  }

  onCreateProject(): void {
    this.errorMessage.set('');

    if (!this.projectForm.valid) {
      this.errorMessage.set('Please fix the errors in the form');
      this.markAllFieldsAsTouched();
      return;
    }

    this.isLoading.set(true);

    const projectData = {
      title: this.projectForm.value.title,
      projectLogo: this.projectForm.value.projectLogo,
      shortDescription: this.projectForm.value.shortDescription,
      fullDescription: this.projectForm.value.fullDescription,
      requirements: this.projectForm.value.requirements,
      projectType: this.projectForm.value.projectType,
      experienceLevel: this.projectForm.value.experienceLevel,
      workType: this.projectForm.value.workType,
      techStack: this.projectForm.value.techStack
    };

    console.log('Project data to create:', projectData);

    this.projectService.create(projectData).subscribe({
      next: (project) => {
        this.isLoading.set(false);
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onCancel(): void {
    if (this.projectForm.dirty) {
      if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        this.router.navigate(['/projects']);
      }
    } else {
      this.router.navigate(['/projects']);
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  private isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return /\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(urlObj.pathname);
    } catch (_) {
      return false;
    }
  }
}