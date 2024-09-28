import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchProductComponent } from './components/search-product/search-product.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

const routes: Routes = [
    {
        path: 'search-products',
        component: SearchProductComponent
    },
    {
        path: 'product-detail/:id',
        component: ProductDetailComponent
    },
    {
        path: '',
        component: ProductsComponent,
        pathMatch: 'full'
    },
    {
        path: '**',
        component: ProductsComponent,
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsRoutingModule { }
