export interface PromotionDish {
  id: string;
  name: string;
}


export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  price: number;
  dishes: PromotionDish[];
  startDate: string;
  endDate: string;
  address?: string;
  phone?: string;
}
