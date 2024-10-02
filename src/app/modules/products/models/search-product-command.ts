import { IProductFilter } from "./product-filter";

export interface ISearchProductCommand {
    page: number;
    filter: IProductFilter | null;
    sortedBy: number | null;
}

export const DEFAULT_SEARCH_PRODUCT_COMMAND: ISearchProductCommand = {
    page: 1,
    filter: null,
    sortedBy: null
}