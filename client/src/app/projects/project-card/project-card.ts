import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Project } from '../../types/project';

@Component({
  selector: 'app-project-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.css']
})
export class ProjectCardComponent {
  @Input() project!: Project;

  logoError = signal<boolean>(false);

  get techStackArray(): string[] {
    return this.project.techStack
      .split(',')
      .map((tech: string) => tech.trim())
      .filter((tech: string) => tech.length > 0);
  }

  get workTypeConfig() {
    const configs = {
      remote: {
        label: 'Remote',
        class: 'remote',
        icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0z M8 21v-4a2 2 0 012-2h2a2 2 0 012 2v4 M9 13h6'
      },
      hybrid: {
        label: 'Hybrid',
        class: 'hybrid',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
      },
      office: {
        label: 'Office',
        class: 'office',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
      }
    };
    return configs[this.project.workType] || configs.office;
  }

  generateTechIcon(tech: string): string {
    const normalizedTech = tech.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/js$/, 'javascript')
      .replace(/ts$/, 'typescript')
      .replace(/nodejs/, 'nodejs')
      .replace(/reactjs/, 'react')
      .replace(/vuejs/, 'vuejs')
      .replace(/angularjs/, 'angularjs')
      .replace(/html/, 'html5')
      .replace(/css/, 'css3');

    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${normalizedTech}/${normalizedTech}-original.svg`;
  }

  onTechIconError(event: any): void {
    // Hide the broken icon
    event.target.style.display = 'none';
  }

  onLogoError(): void {
    this.logoError.set(true);
  }

  hasValidLogo(): boolean {
    return !!(this.project.projectLogo && !this.logoError());
  }
}