import { IProduct } from "./product";

export interface IProductPage {
    products: IProduct[];
    totalItems: number;
}

export const PRODUCT_PAGE_EMPTY: IProductPage = {
    products: [],
    totalItems: 0
}