import { IProductPage } from "./product-page";

export interface IProductsState {
    productsPage: IProductPage;
    status: "loading" | "success" | "error";
    currentPage: number;
    error: string | null;
}
