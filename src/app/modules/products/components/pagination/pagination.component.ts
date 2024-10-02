import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
    @Input({ required: true }) currentPage!: number;
    @Input({ required: true }) totalItems!: number;
    @Input() pageSize: number = 8;
    @Output() pageChange = new EventEmitter<number>();

    get pages(): number {
        return Math.ceil(this.totalItems / this.pageSize);
    }

    get pagesCounter(): number[] {
        return Array(this.pages).fill(0).map((x, i)=> i + 1);
    }
}
