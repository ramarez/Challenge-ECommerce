import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../models/product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShortDescriptionPipe } from '../../../shared/pipes/short-description.pipe';
import { ProductsService } from '../../services/products.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ProductComponent } from '../../components/product/product.component';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, RouterModule, ShortDescriptionPipe, LoadingComponent, ProductComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
    products: IProduct[] = [];

    constructor(private productsService: ProductsService) {

    }
    
    ngOnInit(): void {
        this.productsService.getAll()
            .subscribe((values: IProduct[]) => {
                this.products = values;
            });
    }
}
