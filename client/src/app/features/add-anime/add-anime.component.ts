import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-anime',
    imports: [ReactiveFormsModule],
    templateUrl: './add-anime.component.html',
    styleUrl: './add-anime.component.css',
})
export class AddAnimeComponent {
    private formBuilder = inject(FormBuilder);

    constructor(private apiService: Api, private router: Router) {}

    animeForm = this.formBuilder.group({
        title: ['', [Validators.required, Validators.minLength(2)]],
        author: ['', [Validators.required, Validators.minLength(3)]],
        producedBy: ['', [Validators.required, Validators.minLength(3)]],
        genres: ['', [Validators.required, Validators.minLength(3)]],
        startDate: ['', [Validators.required]],
        endDate: [''],
        description: ['', [Validators.required, Validators.minLength(8)]],
        imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\//)]]
    })

    get titleControl() {
        return this.animeForm.get('title');
    }

    get authorControl() {
        return this.animeForm.get('author');
    }

    get producedByControl() {
        return this.animeForm.get('producedBy');
    }

    get genresControl() {
        return this.animeForm.get('genres');
    }

    get startDateControl() {
        return this.animeForm.get('startDate');
    }

    get endDateControl() {
        return this.animeForm.get('endDate');
    }

    get descriptionControl() {
        return this.animeForm.get('description');
    }

    get imageUrlControl() {
        return this.animeForm.get('imageUrl');
    }

    onSubmit(): void {
        if (this.animeForm.invalid) {
            this.animeForm.markAllAsTouched();
            return;
        }

        this.apiService.postAnime({...this.animeForm.value}).subscribe({
            next: () => {
                this.router.navigateByUrl('/catalogue');
            },

            error: (error) => {
                console.error(error);
            }
        })
    }
}
