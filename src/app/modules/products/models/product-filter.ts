import { ICategory } from "./category";

export interface IProductFilter {
    text: string;
    categories: ICategory[] | null;
    prices: number[] | null;
}
