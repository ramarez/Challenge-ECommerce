import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../models/category';
import { catchError, map, Observable } from 'rxjs';
import { MessageService } from '../../notification/services/message.service';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    protected url = "https://fakestoreapi.com";

    constructor(protected http: HttpClient, private messageService: MessageService) { 
        
    }

    getAll() : Observable<ICategory[]> {
        return this.http.get<string[]>(`${this.url}/products/categories`)
            .pipe(
                map(res => {
                    const data = res.map(obj =>({
                        name: obj
                    }));
                    return data;
                }),
                catchError(err => {
                    this.messageService.error(err, "Error in source", {autoClose: true});
                    throw err;
                })
            );
    }
}
