import { IRating } from "./rating";

export interface IProduct {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    rating: IRating;
}
