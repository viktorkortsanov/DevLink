import { Component, signal } from '@angular/core';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  isActive: boolean;
}

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq-section.html',
  styleUrls: ['./faq-section.css']
})
export class FaqComponent {
  faqItems = signal<FaqItem[]>([
    {
      id: 1,
      question: 'What is DevLink?',
      answer: 'DevLink is a platform that connects developers from around the world. Whether you\'re looking to showcase your skills, find collaborators for projects, or build your professional network, DevLink provides the tools to grow and connect within the dev community.',
      isActive: false
    },
    {
      id: 2,
      question: 'How can I find developers for collaboration?',
      answer: 'You can explore the Developers section and use filters like tech stack, experience, and region to find collaborators. Each developer has a profile with their skills, projects, and reviews to help you decide who to connect with.',
      isActive: false
    },
    {
      id: 3,
      question: 'Can I save projects or developers I like?',
      answer: 'Yes! Just click the save icon on any project or developer profile. Your saved items are easily accessible from your dashboard, allowing you to keep track of potential collaborations or inspiration.',
      isActive: false
    }
  ]);

  toggleFaq(id: number): void {
    this.faqItems.update(items =>
      items.map(item =>
        item.id === id
          ? { ...item, isActive: !item.isActive }
          : item
      )
    );
  }
}