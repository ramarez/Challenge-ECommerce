import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, concatMap, map, Observable, of, skip, switchMap, take, tap, toArray } from 'rxjs';
import { IProduct } from '../models/product';
import { ICategory } from '../models/category';
import { MessageService } from '../../notification/services/message.service';
import { IProductPage } from '../models/product-page';
import { IProductFilter } from '../models/product-filter';
import { ISearchProductCommand } from '../models/search-product-command';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    protected url = "https://fakestoreapi.com";

    constructor(protected http: HttpClient, private messageService: MessageService) { 
        
    }

    getAll(): Observable<IProduct[]> {
        return this.http
            .get<IProduct[]>(`${this.url}/products`)
            .pipe(
                catchError(err => {
                    this.messageService.error(err, "Error in source", {autoClose: true});
                    throw err;
                })
            );
    }

    getPage(page: number, pageSize: number = 8): Observable<IProductPage> {
        let totalItems = 0;
        return this.http
            .get<IProduct[]>(`${this.url}/products`)
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
        return this.http
            .get<IProduct>(`${this.url}/products/${productId}`);
    }

    findPage(command: ISearchProductCommand, pageSize: number = 6): Observable<IProductPage> {
        let totalItems = 0;
        return this.http
            .get<IProduct[]>(`${this.url}/products`)
            .pipe(
                map(x => x.filter(p => this.filterProduct(p, command))),
                tap((products) => {
                    totalItems = products.length;
                    if (command.sortedBy != null) {
                        this.sort(products, command.sortedBy);
                    }
                    
                }),
                concatMap(x => x),
                skip((command.page - 1) * pageSize),
                take(pageSize),
                toArray(),
                switchMap(products => of({products, totalItems: totalItems}))
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

    protected filterProduct(product: IProduct, command: ISearchProductCommand): boolean {
        const inCategory = command.filter?.categories?.length === 0 || command.filter?.categories?.find(x => x.name == product.category) !== undefined;
        const inPrice = command.filter?.prices?.length === 0 || command.filter?.prices?.find(x => {
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

        const text = command.filter?.text || '';
        return (product.title.search(new RegExp(text, "i")) != -1 || product.description.search(new RegExp(text, "i")) != -1) && inCategory && inPrice;
    }
}
