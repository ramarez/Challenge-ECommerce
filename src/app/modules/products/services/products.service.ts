import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { catchError, concatMap, delay, flatMap, map, mergeMap, Observable, of, reduce, retry, skip, startWith, Subject, switchMap, take, tap, toArray } from 'rxjs';
import { IProduct } from '../models/product';
import { ICategory } from '../models/category';
import { MessageService } from '../../notification/services/message.service';
import { IProductPage } from '../models/product-page';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface IProductFilter {
    text: string;
    categories: ICategory[] | null;
    prices: number[] | null;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    protected url = "https://fakestoreapi.com";

    constructor(protected http: HttpClient, private messageService: MessageService) { 
        
    }

    getAll(): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(`${this.url}/products`)
            .pipe(
                catchError(err => {
                    this.messageService.error(err, "Error in source", {autoClose: true});
                    throw err;
                })
            );
    }

    getPage(page: number, pageSize: number = 8): Observable<IProductPage> {
        let totalItems = 0;
        return this.http.get<IProduct[]>(`${this.url}/products`)
            .pipe(
                tap((products) => totalItems = products.length),
                concatMap(x => x),
                skip((page - 1) * pageSize),
                take(pageSize),
                toArray(),
                switchMap(products => of({products, totalItems: totalItems}))
            );
    }

    get(productId: number): Observable<IProduct> {
        return this.http.get<IProduct>(`${this.url}/products/${productId}`)
            .pipe(
                catchError(err => {
                    this.messageService.error(err, "Error in source", {autoClose: true});
                    throw err;
                })
            );
    }

    find(searchText: string, categories: ICategory[], prices: number[], sortBy: number, limit: number = 10): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(`${this.url}/products`)
            .pipe(
                    map(x => x.filter(p => this.filterProduct(p, searchText, categories, prices))),
                    take(limit),
                    tap(result => this.sort(result, sortBy)),
                    catchError(err => {
                        this.messageService.error(err, "Error in source", {autoClose: true});
                        throw err;
                    })
            );
    }

    sort(products: IProduct[], sortBy: number) {
        products.sort((x, y) => {
            switch(sortBy) {
                case 1:
                    return x.rating.rate - y.rating.count;
                case 2:
                    return x.price - y.price;
                case 3:
                    return y.price - x.price;
                default:
                    return x.rating.count - y.rating.count;
            }
        });
    }

    protected filterProduct(product: IProduct, searchText: string, categories: ICategory[], prices: number[]): boolean {
        const inCategory = categories.length === 0 || categories.find(x => x.name == product.category) !== undefined;
        const inPrice = prices.length === 0 || prices.find(x => {
            //'$0 - $50', '$50 - $100', '$100 - $150', '$150 - $200', '$200+'
            switch(x) {
                case 0:
                    return product.price >= 0 && product.price < 50;
                case 1:
                    return product.price >= 50 && product.price < 100;
                case 2:
                    return product.price >= 100 && product.price < 150;
                case 3:
                    return product.price >= 150 && product.price < 200;
                default:
                    return product.price >= 200;
            }
        }) !== undefined;
        return (product.title.search(new RegExp(searchText, "i")) != -1 || product.description.search(new RegExp(searchText, "i")) != -1) && inCategory && inPrice;
    }
}
