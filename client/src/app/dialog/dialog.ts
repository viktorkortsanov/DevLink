import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProjectService } from '../projects/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.css']
})
export class ConfirmDialogComponent {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() isVisible: boolean = false;
  @Input() projectId: string | undefined;

  @Output() cancel = new EventEmitter<void>();

  constructor(private projectService: ProjectService, private router: Router) {}

  onConfirm(): void {
    if (this.projectId) {
      this.projectService.deleteProject(this.projectId).subscribe({
        next: () => {
          console.log('Project deleted successfully');
          this.router.navigate(['/projects']);
          this.cancel.emit();
        },
        error: (error) => {
          console.error('Error deleting project:', error);
        }
      });
      console.log('Deleting project with ID:', this.projectId);
      this.cancel.emit();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onOverlayClick(): void {
    this.onCancel();
  }

  onContentClick(event: Event): void {
    event.stopPropagation();
  }
}