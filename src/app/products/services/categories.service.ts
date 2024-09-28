import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../models/category';
import { map, Observable, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    protected url = "https://fakestoreapi.com";

    constructor(protected http: HttpClient) { 
        
    }

    getAll() : Observable<ICategory[]> {
        return this.http.get<string[]>(`${this.url}/products/categories`)
            .pipe(map(res => {
                const data = res.map(obj =>({
                    name: obj
                }));
                return data;
            }));
    }
}
