import { computed, inject, Injectable, signal } from '@angular/core';
import { IProductsState } from '../../models/products-state';
import { ProductsService } from '../../services';
import { asyncScheduler, BehaviorSubject, of, retry, scheduled, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IProductFilter } from '../../models/product-filter';
import { PRODUCT_PAGE_EMPTY } from '../../models/product-page';
import { DEFAULT_SEARCH_PRODUCT_COMMAND, ISearchProductCommand } from '../../models/search-product-command';

@Injectable()
export class ProductSearchSignalService {
    private productsService = inject(ProductsService);

    private state = signal<IProductsState>({
        productsPage: PRODUCT_PAGE_EMPTY,
        status: "loading",
        currentPage: 1,
        error: null
    });

    // selectors
    products = computed(() => this.state().productsPage.products);
    status = computed(() => this.state().status);
    currentPage = computed(() => this.state().currentPage);
    totalItems = computed(() => this.state().productsPage.totalItems);
    error = computed(() => this.state().error);

    retry$ = new Subject<void>();
    error$ = new Subject<Error>();
    currentPage$ = new BehaviorSubject<ISearchProductCommand>(DEFAULT_SEARCH_PRODUCT_COMMAND);
    productsForPage$ = this.currentPage$
        .pipe(
            switchMap((command) => !command.filter ? scheduled(of(PRODUCT_PAGE_EMPTY),  asyncScheduler) :
                this.productsService.findPage(command)
                    .pipe(
                        retry({
                            delay: (err) => {
                                this.error$.next(err);
                                return this.retry$;
                            },
                        })
                    )
            )
        );

    constructor() { 
        this.productsForPage$
            .pipe(takeUntilDestroyed())
            .subscribe((productsPage) =>
                this.state.update((state) => ({
                    ...state,
                    productsPage,
                    status: "success",
                }))
            );

        this.currentPage$
            .pipe(takeUntilDestroyed())
            .subscribe((command) =>
                this.state.update((state) => ({
                    ...state,
                    currentPage: command.page,
                    status: "loading",
                    productsPage: {products: [], totalItems: 0},
                }))
            );

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
}
