import { Component, inject, OnInit, signal } from '@angular/core';
import { Api } from '../../core/services/api.service';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Notif } from '../../core/services/notif.service';

@Component({
    selector: 'app-add-review',
    imports: [ReactiveFormsModule],
    templateUrl: './add-review.component.html',
    styleUrl: './add-review.component.css',
})
export class AddReviewComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private activatedRoute = inject(ActivatedRoute);    

    constructor(private apiService: Api, private notifService: Notif, private router: Router) {}

    animeId = signal<string | null>(null);
    reviewId = signal<string | null>(null);
    editMode = signal<boolean>(false);

    reviewForm = this.formBuilder.group({
        comment: ['', [Validators.required, Validators.minLength(5)]],
        rating: [5, [Validators.required, Validators.min(1), Validators.max(10)]]
    })

    get commentControl() {
        return this.reviewForm.get('comment');
    }

    get ratingControl() {
        return this.reviewForm.get('rating');
    }

    ngOnInit(): void {
        const animeId = this.activatedRoute.snapshot.params['animeId'];
        this.animeId.set(animeId);

        const reviewId =  this.activatedRoute.snapshot.params['reviewId'];

        if (reviewId) {
            this.editMode.set(true);
            this.reviewId.set(reviewId);
            this.apiService.getSpecificReview(reviewId).subscribe((review) => {
                this.reviewForm.patchValue(review);
            })
        }
    }

    onSubmit() {
        if (this.reviewForm.invalid) {
            this.reviewForm.markAllAsTouched();
            return;
        }

        this.apiService.postReview(this.animeId()!, {...this.reviewForm.value}).subscribe({
            next: () => {
                this.notifService.setSuccessMessage('Successfully posted review!');
                this.router.navigate(['/details', this.animeId()]);
            },

            error: (error) => {
                const errorMessage = error.error?.message;
                this.notifService.setErrorMessage(errorMessage);
            }
        })
    }

    edit() {
        if (this.reviewForm.invalid) {
            this.reviewForm.markAllAsTouched();
            return;
        }

        this.apiService.editReview(this.reviewId()!, {...this.reviewForm.value}).subscribe({
            next: () => {
                this.notifService.setSuccessMessage('Successfuly edited review!');
                this.router.navigateByUrl('/profile');
            },

            error: (error) => {
                const errorMessage = error.error?.message;
                this.notifService.setErrorMessage(errorMessage);
            }
        })
    }

    cancel(): void {
        this.router.navigateByUrl('/profile');
    }
}
