export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductInCart extends Product {
  count?: number;
}

export interface ProductsList {
  // I suggest writing interfaces with a capital letter, so as not to confuse them with variables
  total: number;
  skip: number;
  limit: number;
  products: Product[];
}
