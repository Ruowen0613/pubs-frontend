import { Author } from "./author.interface";

export interface Book {
    title_id: number;
    title: string;
    type: string;
    pub_id: number;
    price: number;
    advance: number;
    royalty: number;
    ytd_sales: number;
    notes: string;
    pubdate: Date;
    royaltyper: number;
    authorNames: string[];
}
  