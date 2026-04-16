import { Component, computed, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-pagination',
    imports: [],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.css',
})
export class PaginationComponent {
    @Input({ required: true }) animeCount!: number;
    @Input({ required: true }) animePerPage!: number;
    @Input({ required: true }) currentPage!: number;
    @Input({ required: true }) setCurrentPage!: (newPage: number) => void;

    paginationPages = computed(() => {
        const totalPages = Math.ceil(this.animeCount / this.animePerPage);
        const currentPage = this.currentPage;

        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages
        }

        pages.push(1);

        if (currentPage > 3) {
            pages.push('...');
        }

        const middleStart = Math.max(5, currentPage - 1);
        const middleEnd = Math.max(totalPages - 1, currentPage + 1);

        for (let i = middleStart; i <= middleEnd; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        pages.push(totalPages);

        return pages;
    })

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
