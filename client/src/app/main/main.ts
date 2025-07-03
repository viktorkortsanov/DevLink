import { Component } from '@angular/core';
import { HeroSection } from "./hero-section/hero-section";
import { FeaturesSection } from "./features-section/features-section";
import { FeedbackSection } from './feedback-section/feedback-section';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-main',
  imports: [HeroSection, FeaturesSection, FeedbackSection],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {

}
