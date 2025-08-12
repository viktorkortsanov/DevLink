import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

@Component({
  selector: 'app-feedback-section',
  imports: [RouterLink],
  templateUrl: './feedback-section.html',
  styleUrls: ['./feedback-section.css']
})
export class FeedbackSection implements AfterViewInit {

  ngAfterViewInit(): void {
    Swiper.use([Navigation, Pagination, Autoplay]);
    
    setTimeout(() => {
      const swiper = new Swiper('.feedbackSwiper', {
        modules: [Navigation, Pagination, Autoplay],
        direction: 'horizontal',
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        }
      });
    }, 200);
  }
}