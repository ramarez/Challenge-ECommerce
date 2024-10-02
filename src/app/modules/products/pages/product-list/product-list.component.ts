import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShortDescriptionPipe } from '../../../shared/pipes/short-description.pipe';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ProductComponent } from '../../components/product/product.component';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ProductsSignalService } from './products-signal.service';
import { ErrorComponent } from '../../../shared';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, RouterModule, ShortDescriptionPipe, LoadingComponent, ProductComponent, PaginationComponent, ErrorComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
    providers: [ProductsSignalService]
})
export class ProductListComponent {
    service =  inject(ProductsSignalService);
}
