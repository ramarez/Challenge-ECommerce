import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../models/product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShortDescriptionPipe } from '../../../pipes/short-description.pipe';
import { ProductsService } from '../../services/products.service';
import { LoadingComponent } from '../../../components/loading/loading.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ShortDescriptionPipe, LoadingComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
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
