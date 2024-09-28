import { Component, inject } from '@angular/core';
import { CartStore } from '../../stores/cart-store';
import { CommonModule } from '@angular/common';
import { routes } from '../../../app.routes';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
    readonly store = inject(CartStore);
    checkoutForm = new FormGroup({
        fullName: new FormControl('', [Validators.required]),
        cardNumber: new FormControl('', [Validators.required]),
    });

    constructor(private router: Router) {

    }

    onSubmit() {
        this.store.removeAll();
        this.router.navigateByUrl("/products");
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
