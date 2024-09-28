import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { ICategory } from '../../models/category';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { IProduct } from '../../models/product';
import { ShortDescriptionPipe } from '../../../pipes/short-description.pipe';
import { RouterModule } from '@angular/router';
import { catchError } from 'rxjs';

@Component({
    selector: 'app-search-product',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, ShortDescriptionPipe, RouterModule],
    templateUrl: './search-product.component.html',
    styleUrl: './search-product.component.scss'
})
export class SearchProductComponent implements OnInit {
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
    foundProducts: IProduct[] = [];
    searching: boolean = false;

    constructor(private categoriesService: CategoriesService,
        private productsService: ProductsService
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
            this.productsService.sort(this.foundProducts, this.sortBy);
        }
    }

    onSubmit() {
        this.showDropdownMenu = false;
        this.showFilterDialog = false;
        this.foundProducts = [];
        this.searching = true;

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
        
        this.productsService.find(this.textSearch.value, categories, prices, this.sortBy)
            .pipe(catchError(err => {
                this.searching = false;
                throw err;
            }))
            .subscribe((values) => {
                this.foundProducts = values;
                this.searching = false;
            });
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

    get showMessage(): boolean {
        return this.searching || this.foundProducts.length === 0;
    }

    get message(): string {
        if (this.searching) {
            return "Searching...";
        }

        return "Not Products";
    }
}
