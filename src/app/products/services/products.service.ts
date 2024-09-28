import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../models/product';
import { ICategory } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
    protected url = "https://fakestoreapi.com";

    constructor(protected http: HttpClient) { 
        
    }

    getAll(): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(`${this.url}/products`);
    }

    get(productId: number): Observable<IProduct> {
        return this.http.get<IProduct>(`${this.url}/products/${productId}`);
    }

    find(searchText: string, categories: ICategory[], prices: number[], sortBy: number, limit: number = 10): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(`${this.url}/products?limit=${limit}`);
    }
}
