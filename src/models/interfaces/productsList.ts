interface productsList {
  total: number;
  skip: number;
  limit: number;
  products: {
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
  }[];
}

export default productsList;