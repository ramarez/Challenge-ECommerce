import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes =
[
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'logout',
        component: LoginComponent
    },
    {
        path: 'products',
        loadChildren: () =>
            import('./modules/products/products.module').then(
                (mod) => mod.ProductsModule
            ),
    },
    {
        path: 'cart',
        loadChildren: () =>
            import('./modules/shopping/shopping.module').then(
                (shopping) => shopping.ShoppingModule
            ),
    },
    { 
        path: '', 
        redirectTo: 'products', 
        pathMatch: 'full' 
    },
    { 
        path: '**', 
        redirectTo: 'products', 
        pathMatch: 'full'
    }
];
