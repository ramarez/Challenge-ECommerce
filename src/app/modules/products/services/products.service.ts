import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, map, Observable, tap } from 'rxjs';
import { IProduct } from '../models/product';
import { ICategory } from '../models/category';
import { MessageService } from '../../notification/services/message.service';

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
        return this.http.get<IProduct[]>(`${this.url}/products?limit=${limit}`)
            .pipe(
                    map(x => x.filter(p => this.filter(p, searchText, categories, prices))),
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

    protected filter(product: IProduct, searchText: string, categories: ICategory[], prices: number[]): boolean {
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
