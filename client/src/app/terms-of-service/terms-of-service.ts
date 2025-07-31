import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-of-service',
  imports: [RouterLink],
  templateUrl: './terms-of-service.html',
  styleUrls: ['./terms-of-service.css']
})
export class TermsOfServiceComponent {
  lastUpdated = 'January 31, 2025';
}