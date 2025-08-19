import { Component, signal, OnInit, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../types/user';
import { AuthService } from '../auth.service';
import { FirebaseStorageService } from '../../services/firebase.service';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfileComponent implements OnInit {
  editProfileForm: FormGroup;
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  isImageUploading = signal<boolean>(false);
  imagePreviewUrl = signal<string>('');
  selectedFile: File | null = null;
  userInfo: User | null = null;
  currentUser = computed(() => this.authService.currentUser());

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private firebaseStorageService: FirebaseStorageService
  ) {
    this.editProfileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      profileImage: [''],
      bio: [''],
      techStack: [''],
      location: [''],
      password: [''],
      rePassword: [''],
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
      this.userInfo = userInfo;

      this.editProfileForm.patchValue({
        username: userInfo.username || '',
        email: userInfo.email || '',
        profileImage: userInfo.profileImage || '',
        bio: userInfo.bio || '',
        techStack: userInfo.techStack || '',
        location: userInfo.location || '',
        githubLink: userInfo.githubLink || '',
        linkedinLink: userInfo.linkedinLink || ''
      });

      if (userInfo.profileImage) {
        this.imagePreviewUrl.set(userInfo.profileImage);
      }
    });
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
        this.imagePreviewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onRemoveImage(): void {
    this.selectedFile = null;
    this.imagePreviewUrl.set('');

    if (this.userInfo?.profileImage) {
      this.imagePreviewUrl.set(this.userInfo.profileImage);
    }

    const fileInput = document.getElementById('profileImageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
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
    if (this.selectedFile) {
      return `Selected: ${this.selectedFile.name}`;
    }
    if (this.userInfo?.profileImage && this.imagePreviewUrl()) {
      return 'Current profile image';
    }
    return 'No image selected';
  }

  async onSaveProfile(): Promise<void> {
    this.errorMessage.set('');

    if (!this.editProfileForm.valid) {
      this.errorMessage.set('Please fix the errors in the form');
      return;
    }

    const formValue = this.editProfileForm.value;

    if (formValue.password && formValue.password !== formValue.rePassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.isLoading.set(true);

    try {
      let profileImageUrl = formValue.profileImage;

      if (this.selectedFile) {
        this.isImageUploading.set(true);
        profileImageUrl = await this.firebaseStorageService.uploadProfileImage(this.selectedFile);
        this.isImageUploading.set(false);
      }

      const profileData = {
        username: formValue.username,
        email: formValue.email,
        profileImage: profileImageUrl,
        bio: formValue.bio,
        techStack: formValue.techStack,
        location: formValue.location,
        githubLink: formValue.githubLink,
        linkedinLink: formValue.linkedinLink
      };

      const userId = this.route.snapshot.paramMap.get('userId');
      this.authService.updateUserProfile(profileData);

      this.userService.updateUserInfo(userId, profileData).subscribe({
        next: (updatedUser) => {
          this.isLoading.set(false);

          localStorage.setItem('user', JSON.stringify({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            profileImage: updatedUser?.profileImage || null,
            role: updatedUser.role,
            isAdmin: updatedUser.isAdmin
          }));

          this.router.navigate([`/profile/${userId}`]);
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
      console.error('Error saving profile:', error);
    }
  }

  onCancel(): void {
    if (this.editProfileForm.dirty || this.selectedFile) {
      if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        this.router.navigate([`/profile/${this.userInfo?._id}`]);
      }
    } else {
      this.router.navigate([`/profile/${this.userInfo?._id}`]);
    }
  }
}