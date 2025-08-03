import { Component, signal, OnInit, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Project } from '../../types/project';
import { ProjectService } from '../project.service';
import { FirebaseStorageService } from '../../services/firebase.service';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../../config/firebase.config';
import { AuthService } from '../../user/auth.service';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-project.html',
  styleUrls: ['./edit-project.css']
})
export class EditProjectComponent implements OnInit {
  projectForm: FormGroup;
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  isImageUploading = signal<boolean>(false);
  logoPreviewUrl = signal<string>('');
  selectedFile: File | null = null;
  projectId: string | null = null;
  currentProject: Project | null = null;
  currentUser = computed(() => this.authService.currentUser());


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
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private firebaseStorageService: FirebaseStorageService,
    private authService: AuthService
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
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.loadProjectData();

    if (this.currentProject?.owner !== this.currentUser()?._id) {
      this.router.navigate(['/']);
    }
  }

  loadProjectData(): void {
    if (!this.projectId) {
      console.log(this.projectId);
      this.router.navigate(['/projects']);
      return;
    }

    this.projectService.getDetails(this.projectId).subscribe({
      next: (project) => {
        this.currentProject = project;
        this.populateForm(project);
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.errorMessage.set('Failed to load project data');
      }
    });
  }

  populateForm(project: Project): void {
    this.projectForm.patchValue({
      title: project.title || '',
      projectLogo: project.projectLogo || '',
      shortDescription: project.shortDescription || '',
      fullDescription: project.fullDescription || '',
      requirements: project.requirements || '',
      projectType: project.projectType || '',
      experienceLevel: project.experienceLevel || '',
      workType: project.workType || '',
      techStack: project.techStack || ''
    });

    if (project.projectLogo) {
      this.logoPreviewUrl.set(project.projectLogo);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const validation = this.firebaseStorageService.validateFile(file);
      if (!validation.isValid) {
        this.errorMessage.set(validation.error || 'Invalid file');
        return;
      }

      this.selectedFile = file;
      this.errorMessage.set('');

      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoPreviewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onRemoveImage(): void {
    this.selectedFile = null;
    this.logoPreviewUrl.set('');

    if (this.currentProject?.projectLogo) {
      this.logoPreviewUrl.set(this.currentProject.projectLogo);
    }

    const fileInput = document.getElementById('projectLogoFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getLogoFilename(): string {
    if (this.selectedFile) {
      return `Selected: ${this.selectedFile.name}`;
    }
    if (this.currentProject?.projectLogo && this.logoPreviewUrl()) {
      return 'Current project logo';
    }
    return 'No logo selected';
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

  async onUpdateProject(): Promise<void> {
    this.errorMessage.set('');

    if (!this.projectForm.valid) {
      this.errorMessage.set('Please fix the errors in the form');
      this.markAllFieldsAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      let projectLogoUrl = this.projectForm.value.projectLogo;

      if (this.selectedFile) {
        this.isImageUploading.set(true);

        if (this.currentProject?.projectLogo) {
          await this.deleteProjectImage(this.currentProject.projectLogo);
        }

        projectLogoUrl = await this.uploadProjectImage(this.selectedFile);
        this.isImageUploading.set(false);
      }

      const projectData = {
        title: this.projectForm.value.title,
        projectLogo: projectLogoUrl,
        shortDescription: this.projectForm.value.shortDescription,
        fullDescription: this.projectForm.value.fullDescription,
        requirements: this.projectForm.value.requirements,
        projectType: this.projectForm.value.projectType,
        experienceLevel: this.projectForm.value.experienceLevel,
        workType: this.projectForm.value.workType,
        techStack: this.projectForm.value.techStack
      };

      this.projectService.updateProject(this.projectId, projectData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.router.navigate(['/projects', this.projectId, 'details']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Update failed');
        }
      });

    } catch (error) {
      this.isLoading.set(false);
      this.isImageUploading.set(false);
      this.errorMessage.set('Failed to upload image. Please try again.');
      console.error('Error updating project:', error);
    }
  }

  private async uploadProjectImage(file: File): Promise<string> {
    const fileName = `projectImages/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, fileName);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  }

  private async deleteProjectImage(imageUrl: string): Promise<void> {
    try {
      const fileName = this.extractFileNameFromURL(imageUrl);
      if (fileName) {
        const fileRef = ref(storage, fileName);
        await deleteObject(fileRef);
      }
    } catch (error) {
      console.error('Error deleting old project logo:', error);
    }
  }

  private extractFileNameFromURL(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const match = pathname.match(/\/o\/(.+?)$/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
      return null;
    } catch (error) {
      console.error('Error extracting filename:', error);
      return null;
    }
  }

  onCancel(): void {
    if (this.projectForm.dirty || this.selectedFile) {
      if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        this.router.navigate(['/projects', this.projectId, 'details']);
      }
    } else {
      this.router.navigate(['/projects', this.projectId, 'details']);
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
}