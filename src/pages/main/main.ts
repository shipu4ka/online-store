import Page from '../../models/templates/page';
import { ProductsList } from '../../models/interfaces/productsList';

class MainPage extends Page {
  static TextObject = {
    MainTitle: 'Home page',
  };

  constructor(id: string) {
    super(id);
  }

  async getProducts() {
    const data = await this.getPageData();
    return console.log(data.products);
  }

  async getCategories() {
    const data = await this.getProductsCategories();

    const filters = document.querySelector('.filters')!;

    const categories = this.createPageBlock('ul', 'filters__categories');
    data.forEach((item) => {
      const elem = this.createPageBlock('li', 'filters__category');
      elem.textContent = item;
      categories.append(elem);
    });

    filters.append(categories);
  }

  createFilters() {
    const filters = this.createPageBlock('aside', 'filters');

    const buttons = this.createPageBlock('div', 'filters__buttons');
    const btn1 = this.createPageBlock('button', 'filters__button');
    btn1.textContent = 'Reset Filters';
    const btn2 = this.createPageBlock('button', 'filters__button');
    btn2.textContent = 'Copy Link';

    buttons.append(...[btn1, btn2]);
    filters.append(...[buttons]);

    return filters;
  }

  createCads() {
    const cards = this.createPageBlock('section', 'cards');
    return cards;
  }

  render() {
    // const title = this.createPageTitle(MainPage.TextObject.MainTitle);
    const mainWrapper = this.createPageBlock('div', 'wrapper');
    const filters = this.createFilters();
    const cards = this.createCads();
    mainWrapper.append(...[filters, cards]);
    this.main?.append(mainWrapper);

    this.getProducts();
    this.getCategories();

    return this.main;
  }
}

export default MainPage;
