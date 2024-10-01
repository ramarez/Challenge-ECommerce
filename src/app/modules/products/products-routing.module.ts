import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductSearchComponent } from './pages/product-search/product-search.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProductListComponent } from './pages/product-list/product-list.component';

const routes: Routes = [
    {
        path: 'product-search',
        component: ProductSearchComponent
    },
    {
        path: 'product-detail/:id',
        component: ProductDetailComponent
    },
    {
        path: '',
        component: ProductListComponent,
        pathMatch: 'full'
    },
    {
        path: '**',
        component: ProductListComponent,
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsRoutingModule { }
