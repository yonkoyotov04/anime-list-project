import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-pagination',
    imports: [],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.css',
})
export class PaginationComponent implements OnInit {
    @Input({ required: true }) animeCount!: number;
    @Input({ required: true }) animePerPage!: number;
    @Input({ required: true }) currentPage!: number;
    @Input({ required: true }) setCurrentPage!: (newPage: number) => void;

    pages: Number[] = [];

    ngOnInit(): void {
        for (let i = 1; i <= Math.ceil(this.animeCount / this.animePerPage); i++) {
            this.pages.push(i);
        }
    }

    previousPage(): void {
        const prevPage = this.currentPage - 1;
        this.setCurrentPage(prevPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    specificPage(page: any): void {
        this.setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    nextPage(): void {
        const nextPage = this.currentPage + 1;
        this.setCurrentPage(nextPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }


}
