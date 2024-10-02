import { patchState, signalStore, withComputed, withMethods } from "@ngrx/signals";
import { IProduct } from "../../products/models/product";
import { computed } from "@angular/core";
import { addEntity, removeAllEntities, removeEntity, setEntity, updateEntities, withEntities } from "@ngrx/signals/entities";

export type CartItem = {
    id: number;
    product: IProduct;
    quantity: number
};

export const CartStore = signalStore(
    withEntities<CartItem>(),
    withMethods((store) => ({
        addCartItem(cartItem: CartItem): void {
            patchState(store, addEntity(cartItem));
        },
        setCartItem(cartItem: CartItem): void {
            patchState(store, setEntity(cartItem));
        },
        removeAll(): void {
            patchState(store, removeAllEntities());
        },
        increment(key: number[]): void {
            patchState(
                store,
                updateEntities({
                    ids: key,
                    changes: (itemCart) => ({ quantity: itemCart.quantity + 1 })
                })
            );
        },
        decrement(key: number[]): void {
            patchState(
                store,
                updateEntities({
                    ids: key,
                    changes: (itemCart) => ({ quantity: itemCart.quantity - 1 })
                })
            );
        },
        remove(key: number): void {
            patchState(store, removeEntity(key));
        },
    })),
    withComputed((store) => ({
        itemsCount: computed(() => store.entities().length),
        originalPrice: computed(() => store.entities().reduce((acc, x) => acc + x.quantity * x.product.price, 0))
    }))
);