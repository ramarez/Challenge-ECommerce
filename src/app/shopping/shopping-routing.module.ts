import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ShoppingGuard } from './guards/shopping.guard';

const routes: Routes = [
    {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [ShoppingGuard]
    },
    {
        path: '',
        component: CartComponent,
        pathMatch: 'full'
    },
    {
        path: '**',
        component: CartComponent,
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShoppingRoutingModule { }
