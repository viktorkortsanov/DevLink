import { Component, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../types/user';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfileComponent implements OnInit {
  editProfileForm: FormGroup;
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  imagePreviewUrl = signal<string>('');
  userInfo: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editProfileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      profileImage: [''],
      bio: [''],
      location: [''],
      password: [''],
      confirmPassword: [''],
      githubLink: [''],
      linkedinLink: ['']
    });
  }

  ngOnInit(): void {
    this.loadCurrentUserData();
  }

  loadCurrentUserData(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    this.userService.getUserInfo(userId).subscribe((userInfo: User) => {
      console.log(userInfo);
      this.userInfo = userInfo;

      this.editProfileForm.patchValue({
        username: userInfo.username || '',
        email: userInfo.email || '',
        profileImage: userInfo.profileImage || '',
        bio: userInfo.bio || '',
        location: userInfo.location || '',
        githubLink: userInfo.githubLink || '',
        linkedinLink: userInfo.linkedinLink || ''
      });
    });
  }

  onImageUrlChange(): void {
    const imageUrl = this.editProfileForm.get('profileImage')?.value;
    if (imageUrl && this.isValidUrl(imageUrl)) {
      this.imagePreviewUrl.set(imageUrl);
    } else {
      this.imagePreviewUrl.set('');
    }
  }

  onImageError(): void {
    this.imagePreviewUrl.set('');
  }

  getInitials(): string {
    const username = this.editProfileForm.get('username')?.value || 'User';
    return username
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getImageFilename(): string {
    const imageUrl = this.editProfileForm.get('profileImage')?.value;
    if (imageUrl && this.imagePreviewUrl()) {
      const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
      return `Preview: ${filename}`;
    }
    return 'Current: Default Avatar';
  }

  onSaveProfile(): void {
    this.errorMessage.set('');

    if (!this.editProfileForm.valid) {
      this.errorMessage.set('Please fix the errors in the form');
      return;
    }

    const formValue = this.editProfileForm.value;

    if (formValue.password && formValue.password !== formValue.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.isLoading.set(true);

    const profileData = {
      username: formValue.username,
      email: formValue.email,
      profileImage: formValue.profileImage,
      bio: formValue.bio,
      location: formValue.location,
      githubLink: formValue.githubLink,
      linkedinLink: formValue.linkedinLink
    };

    console.log('Profile data to save:', profileData);

    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/profile']);
    }, 1000);
  }

  onCancel(): void {
    if (this.editProfileForm.dirty) {
      if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        this.router.navigate(['/profile']);
      }
    } else {
      this.router.navigate(['/profile']);
    }
  }

  private isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
}