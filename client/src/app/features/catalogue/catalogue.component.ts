import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Api } from '../../core/services/api.service';
import { Anime } from '../../shared/interfaces/anime';
import { AnimeItemComponent } from '../../shared/components/anime-item/anime-item.component';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';

@Component({
    selector: 'app-catalogue',
    imports: [AnimeItemComponent, ReactiveFormsModule],
    templateUrl: './catalogue.component.html',
    styleUrl: './catalogue.component.css',
})
export class CatalogueComponent implements OnInit {
    private formBuilder = inject(FormBuilder);

    sortType = signal<string | null>(null);

    sortedAnimes = computed(() => {
        const list = this.apiService.animes();
        const type = this.sortType();
        
        switch(type) {
            case 'title(alph)': {
                return [...list].sort((a, b) => a.title.localeCompare(b.title));
            }
            case 'title(reAlph)': {
                return [...list].sort((a, b) => b.title.localeCompare(a.title));
            }
            case 'rating(asc)': {
                return [...list].sort((a, b) => a.rating - b.rating);
            }
            case 'rating(desc)': {
                return [...list].sort((a, b) => b.rating - a.rating);
            }
            case 'newest': {
                return [...list].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
            }
            case 'oldest': {
                return [...list].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
            }
        }

        return list;
    })

    constructor(private apiService: Api) { }

    ngOnInit(): void {
        this.apiService.getAnime().subscribe((animes) => {
            this.apiService.setAnimes(animes);
        })
    }

    searchForm = this.formBuilder.group({
        type: ['title', [Validators.required]],
        search: ['']
    })

    sortForm = this.formBuilder.group({
        criteria: ['title(alph)', [Validators.required]]
    })

    onSearch() :void {
        const searchType = this.searchForm.value.type;
        const searchInput = this.searchForm.value.search;

        this.apiService.getAnimeWithQuery(searchType!, searchInput!).subscribe((animes) => {
            this.apiService.setAnimes(animes);
        })
    }

    onSort() :void {
        const sortValue = this.sortForm.value.criteria;
        this.sortType.set(sortValue!);        
    }
}
