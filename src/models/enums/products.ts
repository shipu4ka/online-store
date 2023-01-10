enum ProductsUrlAPI {
  AllProducts = 'https://dummyjson.com/products?limit=100',
  ProductsCategories = 'https://dummyjson.com/products/categories',
  Product = 'https://dummyjson.com/products',
}

export enum LocalStorageKey {
  productsInCart = 'productsInCart',
  limit = 'limit',
  arrDiscount = 'arrDiscount',
  currentPage = 'currentPage',
}

export default ProductsUrlAPI;