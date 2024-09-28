import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { IProduct } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartStore } from '../../../shopping/stores/cart-store';
import { ShowDescriptionDirective } from '../../../directives/show-description.directive';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ShowDescriptionDirective],
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit {
    readonly store = inject(CartStore);
    product: IProduct = {rating: {rate: 0}} as IProduct;
    cartForm = new FormGroup({
        quantity: new FormControl(1, [Validators.required, Validators.min(1)])
    });
    
    constructor(private route: ActivatedRoute,
        private productsService: ProductsService,
        private ref: ChangeDetectorRef
    ) {

    }

    ngOnInit(): void {
        this.route.paramMap
            .pipe(
                switchMap(params => {
                    const productId = Number(params.get('id'));
                    return this.productsService.get(productId);
                })
            )
            .subscribe((value: IProduct) => {
                this.product = value;
                this.ref.markForCheck();
            });
    }

    onSubmit() {
        console.log(this.store.entityMap)
        this.store.setCartItem({id: this.product.id, product: this.product, quantity: this.quantity.value});
        this.quantity.setValue(1);
        console.log(this.store.entities())
    }

    get rate(): number[] {
        return Array.from(Array(Math.ceil(this.product.rating.rate)).keys());
    }

    get quantity(): FormControl {
        return this.cartForm.get('quantity') as FormControl;
    }
}
