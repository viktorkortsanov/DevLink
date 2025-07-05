import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
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

  onConfirm(): void {
    if (this.projectId) {
      // TODO: Add your delete project logic here
      // this.projectService.deleteProject(this.projectId).subscribe({
      //   next: () => {
      //     console.log('Project deleted successfully');
      //     this.cancel.emit(); // Close dialog after successful delete
      //   },
      //   error: (error) => {
      //     console.error('Error deleting project:', error);
      //   }
      // });
      
      console.log('Deleting project with ID:', this.projectId);
      this.cancel.emit(); // Close dialog (remove this when implementing real logic)
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