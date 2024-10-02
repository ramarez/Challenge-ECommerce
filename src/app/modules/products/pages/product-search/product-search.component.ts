import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { ICategory } from '../../models/category';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorComponent, LoadingComponent, ShortDescriptionPipe } from '../../../shared';
import { RouterModule } from '@angular/router';
import { ProductComponent } from '../../components/product/product.component';
import { ProductSearchSignalService } from './product-search-signal.service';
import { IProductFilter } from '../../models/product-filter';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
    selector: 'app-search-product',
    standalone: true,
    imports: [CommonModule, 
        ReactiveFormsModule, FormsModule, 
        ShortDescriptionPipe, RouterModule, PaginationComponent,
        ProductComponent, LoadingComponent, ErrorComponent],
    templateUrl: './product-search.component.html',
    styleUrl: './product-search.component.scss',
    providers: [ProductSearchSignalService]
})
export class ProductSearchComponent implements OnInit {
    service =  inject(ProductSearchSignalService);
    
    showDropdownMenu: boolean = false;
    showCategoryMenu: boolean = false;
    showPriceMenu: boolean = false;
    showFilterDialog: boolean = false;
    categoryList: ICategory[] = [];
    priceList: string[] = ['$0 - $50', '$50 - $100', '$100 - $150', '$150 - $200', '$200+'];
    searchForm = new FormGroup({
        textSearch: new FormControl('', [Validators.required, Validators.minLength(4)]),
        categories: new FormArray([]),
        prices: new FormArray([])
    });
    sortBy: number = 0;

    constructor(private categoriesService: CategoriesService
    ) {

    }

    ngOnInit(): void {
        this.priceList.forEach(x => this.prices.push(new FormControl(false)));
        this.categoriesService.getAll()
            .subscribe((data) => {
                this.categoryList = data;
                data.forEach(x => this.categories.push(new FormControl(false)));
            });
    }

    toggleDropdownMenu() {
        this.showDropdownMenu = !this.showDropdownMenu;
    }

    toggleCategoryMenu() {
        this.showDropdownMenu = false;
        this.showCategoryMenu = !this.showCategoryMenu;
    }

    togglePriceMenu() {
        this.showDropdownMenu = false;
        this.showPriceMenu = !this.showPriceMenu;
    }

    toggleFilterDialog() {
        this.showFilterDialog = !this.showFilterDialog;
    }

    onSort(sortOrder: number) {
        this.showDropdownMenu = false;
        if (sortOrder != this.sortBy) {
            this.sortBy = sortOrder;
            if (this.service.totalItems() > 0 && this.searchForm.valid) {
                this.pageChanged(1);                
            }
        }
    }

    onSubmit() {
        this.showDropdownMenu = false;
        this.showFilterDialog = false;

        this.pageChanged(1);
    }

    pageChanged(page: number) {
        this.service.currentPage$
            .next({
                page: page, 
                filter: this.productFilter, 
                sortedBy: this.sortBy
            });
    }

    get productFilter(): IProductFilter {
        const categories: ICategory[] = [];
        const prices: number[] = [];

        this.categories.controls.forEach((control, index: number) => {
            if (control.value) {
                categories.push(this.categoryList[index]);
            }
        });
        this.prices.controls.forEach((control, index: number) => {
            if (control.value) {
                prices.push(index);
            }
        });

        return {
            text: this.textSearch.value as string,
            categories,
            prices
        }
    }

    get textSearch(): FormControl {
        return this.searchForm.get('textSearch') as FormControl;
    }

    get categories(): FormArray {
        return this.searchForm.get('categories') as FormArray;
    }

    get prices(): FormArray {
        return this.searchForm.get('prices') as FormArray;
    }
}
