import { Component, inject, OnInit, signal } from '@angular/core';
import { Api } from '../../core/services/api.service';
import { Auth } from '../../core/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-add-review',
    imports: [ReactiveFormsModule],
    templateUrl: './add-review.component.html',
    styleUrl: './add-review.component.css',
})
export class AddReviewComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private activatedRoute = inject(ActivatedRoute);    

    constructor(private apiService: Api, private authService: Auth, private router: Router) {}

    animeId = signal<string | null>(null);

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
        const animeId = this.activatedRoute.snapshot.params['animeId']
        this.animeId.set(animeId);
    }

    onSubmit() {
        if (this.reviewForm.invalid) {
            this.reviewForm.markAllAsTouched();
            return;
        }

        this.apiService.postReview(this.animeId()!, {...this.reviewForm.value}).subscribe({
            next: () => {
                this.router.navigate(['/details', this.animeId()]);
            },

            error: (error) => {
                console.error(error);
            }
        })
    }

    cancel(): void {
        this.router.navigate(['/details', this.animeId()]);
    }
}
