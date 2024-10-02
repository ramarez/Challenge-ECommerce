import { computed, inject, Injectable, signal } from '@angular/core';
import { IProduct } from '../../models';
import { BehaviorSubject, map, retry, startWith, Subject, switchMap, tap } from 'rxjs';
import { ProductsService } from '../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IProductPage } from '../../models/product-page';
import { MessageService } from '../../../notification';

export interface IProductsState {
    productsPage: IProductPage;
    status: "loading" | "success" | "error";
    currentPage: number;
    error: string | null;
}

@Injectable()
export class ProductsSignalService {
    private productsService = inject(ProductsService);
    private messageService = inject(MessageService);

    private state = signal<IProductsState>({
        productsPage: {products: [], totalItems: 0},
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
    currentPage$ = new BehaviorSubject<number>(1);
    productsForPage$ = this.currentPage$
        .pipe(
            switchMap((currentPage) => this.productsService.getPage(currentPage).pipe(
                retry({
                    delay: (err) => {
                        this.error$.next(err);
                        return this.retry$;
                    },
                })))
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
            .subscribe((currentPage) =>
                this.state.update((state) => ({
                    ...state,
                    currentPage,
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
