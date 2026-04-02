import { Component, Input } from '@angular/core';
import { Review } from '../../interfaces/review';

@Component({
    selector: 'app-review-item',
    imports: [],
    templateUrl: './review-item.component.html',
    styleUrl: './review-item.component.css',
})
export class ReviewItemComponent {
    @Input ({required: true}) review!: Review;
}
