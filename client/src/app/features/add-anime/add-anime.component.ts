import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Notif } from '../../core/services/notif.service';

@Component({
    selector: 'app-add-anime',
    imports: [ReactiveFormsModule],
    templateUrl: './add-anime.component.html',
    styleUrl: './add-anime.component.css',
})
export class AddAnimeComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private activatedRoute = inject(ActivatedRoute);

    animeId = signal<string|null>(null);
    editMode = signal<boolean>(false);

    constructor(private apiService: Api, private notifService: Notif, private router: Router) {}

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

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.params['animeId'];

        if (id) {
            this.editMode.set(true);
            this.animeId.set(id);
            this.apiService.getSpecificAnime(id).subscribe((anime) => {
                this.animeForm.patchValue(anime);
            })
        }
    }

    onSubmit(): void {
        if (this.animeForm.invalid) {
            this.animeForm.markAllAsTouched();
            return;
        }

        this.apiService.postAnime({...this.animeForm.value}).subscribe({
            next: () => {
                this.notifService.setSuccessMessage("Successfully added anime!")
                this.router.navigateByUrl('/catalogue');
            },

            error: (error) => {
                const errorMessage = error.error?.message;
                this.notifService.setErrorMessage(errorMessage);
            }
        })
    }

    edit(): void {
        if (this.animeForm.invalid) {
            this.animeForm.markAllAsTouched();
            return;
        }

        this.apiService.editAnime(this.animeId()!, {...this.animeForm.value}).subscribe({
            next: () => {
                this.notifService.setSuccessMessage('Successfully edited anime!')
                this.router.navigateByUrl(`/details/${this.animeId()}`);
            },

            error: (error) => {
                const errorMessage = error.error?.message;
                this.notifService.setErrorMessage(errorMessage);
            }
        })
    }

    cancel(): void {
        if(this.editMode()) {
            this.router.navigate(['/details', this.animeId()])
        } else {
            this.router.navigateByUrl('/catalogue');
        }
        
    }
}
