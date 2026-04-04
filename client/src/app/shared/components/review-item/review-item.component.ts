import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Review } from '../../interfaces/review';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
    selector: 'app-review-item',
    imports: [RouterLink, RouterModule],
    templateUrl: './review-item.component.html',
    styleUrl: './review-item.component.css',
})
export class ReviewItemComponent {
    @Input ({required: true}) review!: Review;
    @Input ({required: false}) inUserPage!: Boolean;
    @Input ({required: false}) isOwner!: Boolean;

    @Output() delete = new EventEmitter<string>();

    onDeleteClick() {
        this.delete.emit(this.review._id);
    }
}
