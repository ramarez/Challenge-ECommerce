import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartItem, CartStore } from '../../stores/cart-store';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [RouterModule, CommonModule],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'

})
export class CartComponent {
    readonly store = inject(CartStore);
    
    remove(cartItem: CartItem) {
        this.store.remove(cartItem.id);
    }

    increment(cartItem: CartItem) {
        this.store.increment([cartItem.id]);
    }

    decrement(cartItem: CartItem) {
        this.store.decrement([cartItem.id]);
    }

    get originalPrice(): number {
        return this.store.originalPrice();
    }

    get tax(): number {
        return this.originalPrice * 0.25;
    }

    get total(): number {
        return this.originalPrice + this.tax;
    }
}
