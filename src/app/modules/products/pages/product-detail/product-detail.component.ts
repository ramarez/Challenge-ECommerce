import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { retry, Subject, switchMap } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { IProduct } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartStore } from '../../../shopping/stores/cart-store';
import { ShowDescriptionDirective } from '../../../shared/directives/show-description.directive';
import { MessageService } from '../../../notification/services/message.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorComponent } from '../../../shared';

export interface IProductState {
    product: IProduct | null;
    status: "loading" | "success" | "error";
    error: string | null;
}

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ShowDescriptionDirective, LoadingComponent, ErrorComponent],
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit {
    readonly store = inject(CartStore);
    //product: IProduct = {} as IProduct;
    cartForm = new FormGroup({
        quantity: new FormControl(1, [Validators.required, Validators.min(1)])
    });

    private state = signal<IProductState>({
        product: null,
        status: "loading",
        error: null
    });

    product = computed(() => this.state().product);
    status = computed(() => this.state().status);
    error = computed(() => this.state().error);

    retry$ = new Subject<void>();
    error$ = new Subject<Error>();
    
    constructor(private route: ActivatedRoute,
        private productsService: ProductsService,
        private ref: ChangeDetectorRef,
        private messageService: MessageService,
        private router: Router
    ) {
        this.retry$
            .pipe(takeUntilDestroyed())
            .subscribe(() =>
                this.state.update((state) => ({ ...state, status: "loading" }))
            );

        this.error$
            .pipe(takeUntilDestroyed())
            .subscribe((error) => {
                this.state.update((state) => ({
                    ...state,
                    status: "error",
                    error: error.message,
                }))
            });
    }

    ngOnInit(): void {
        this.route.paramMap
            .pipe(
                switchMap(params => {
                    const productId = Number(params.get('id'));
                    return this.productsService
                        .get(productId).pipe(
                            retry({
                                delay: (err) => {
                                    this.error$.next(err);
                                    return this.retry$;
                                },
                            }));
                })
            )
            .subscribe((product: IProduct) => {
                this.state.update((state) => ({
                    ...state,
                    product,
                    status: "success",
                }))
                
                this.ref.markForCheck();
            });
    }

    onSubmit() {
        if (this.product()) {
            this.store.setCartItem({id: this.product()?.id || 0, product: this.product() || {} as IProduct, quantity: parseInt(this.quantity.value)});
            this.messageService.success(`Update ${this.quantity.value} '${this.product()?.title}'.`, 'Shopping Card: Update successful', {autoClose: true, keepAfterRouteChange: true});
            this.router.navigateByUrl('/products/product-search');
        }
    }

    get rate(): number[] {
        return Array.from(Array(Math.ceil(this.product()?.rating.rate || 0)).keys());
    }

    get quantity(): FormControl {
        return this.cartForm.get('quantity') as FormControl;
    }
}
