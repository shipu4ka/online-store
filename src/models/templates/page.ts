import { ProductsList } from '../interfaces/productsList';
import ProductsUrlAPI from '../enums/products';

abstract class Page {
  protected main: HTMLElement;
  static TextObject = {};

  constructor(id: string) {
    this.main = document.querySelector('.content')!;
    if (this.main) {
      this.main.id = id;
    }
  }

  protected createPageTitle(title: string) {
    const mainTitle = this.createPageBlock('h1', 'title');
    mainTitle.innerText = title;
    return mainTitle;
  }

  protected createPageBlock(tag: string, className: string, className2?: string) {
    const block = document.createElement(tag);
    block.classList.add(className);
    if (className2) {
      block.classList.add(className2);
    }
    return block;
  }

  protected async getPageData() {
    try {
      const apiData: ProductsList = await fetch(ProductsUrlAPI.AllProducts).then((res) => res.json());
      return apiData;
    } catch (error) {
      throw new Error('Error: ' + error);
    }
  }

  protected async getProductsCategories() {
    try {
      const apiData: Promise<string[]> = await fetch(ProductsUrlAPI.ProductsCategories).then((res) =>
        res.json()
      );
      return apiData;
    } catch (error) {
      throw new Error('Error: ' + error);
    }
  }

  render() {
    return this.main;
  }
}

export default Page;
