import Page from '../../models/templates/page';
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { ProductsList } from '../../models/interfaces/productsList';

class MainPage extends Page {
  static TextObject = {
    MainTitle: 'Home page',
  };

  constructor(id: string) {
    super(id);
  }

  createCategoriesBlock(parentClass: string, childClass: string, totalMod: string, data: string[]) {
    const ul = this.createPageBlock('ul', parentClass);

    data.forEach((item) => {
      const elem = this.createPageBlock('li', childClass);
      const label = this.createPageBlock('label', 'filters__label');
      const labelText = this.createPageBlock('span', 'filters__label-text');
      labelText.textContent = item;

      const checkbox = this.createPageBlock('input', 'filters__checkbox');
      checkbox.setAttribute('type', 'checkbox');

      const brandTotal = this.createPageBlock('span', 'filters__total', totalMod);
      brandTotal.textContent = '0/0';

      label.append(...[checkbox, labelText]);
      elem.append(...[label, brandTotal]);
      ul.append(elem);
    });

    return ul;
  }

  createTitle(content:string) {
    const title = this.createPageBlock('h2', 'filters__title', 'title');
    title.textContent = content;
    return title;
  }

  async getProducts() {
    const data = await this.getPageData();
    return console.log(data.products);
  }

  async getCategories(filters: HTMLElement) {
    const data = await this.getProductsCategories();
    const title = this.createTitle('Category');
    const categories = this.createCategoriesBlock('filters__categories', 'filters__category', 'filters__total-category', data);
    filters.append(...[title, categories]);
  }

  async getBrand(filters: HTMLElement) {
    const data = await this.getPageData();
    const title = this.createTitle('Brand');
    const dataProducts = data.products;
    const arrDataProducts: string[] = [];

    dataProducts.forEach((item) => {
      const allBrands = item.brand.toLowerCase();
      arrDataProducts.push(allBrands);
    })

    const uniqArrDataProducts = [...new Set(arrDataProducts)];
    const brand = this.createCategoriesBlock('filters__brands', 'filters__brand', 'filters__total-brand', uniqArrDataProducts);


    // const objDataProducts = arrDataProducts.map((name) => {
    //   return {count: 0, name: name}
    // });

    // const uniq = objDataProducts.forEach((item, index) => {
    //   if (item.name)
    // })

    console.log(arrDataProducts);
    console.log(uniqArrDataProducts);
    // console.log(objDataProducts);
    // console.log(uniq);

    filters.append(...[title, brand]);
  }

  createMultiRangeSlider(filters: HTMLElement, titleNode: string, min: string, max: string) {
    const title = this.createTitle(titleNode);
    const slider = this.createPageBlock('div', 'filters__slider','slider');
    const sliderBody  = this.createPageBlock('div', 'slider__body') as noUiSlider.target;
    const inputs = this.createPageBlock('div', 'slider__inputs');
    const label1 = this.createPageBlock('label', 'slider__label');
    const span1 = this.createPageBlock('span', 'slider__text');
    span1.textContent = 'min: $';
    const input1 = this.createPageBlock('input', 'slider__input') as HTMLInputElement;
    input1.setAttribute('type', 'number');
    input1.setAttribute('min', min); //setup through promise
    input1.setAttribute('max', max); //setup through promise
    input1.setAttribute('value', min); //setup through promise
    input1.setAttribute('placeholder', min); //setup through promise
    input1.setAttribute('id', 'input1');
    const label2 = this.createPageBlock('label', 'slider__label');
    const span2 = this.createPageBlock('span', 'slider__text');
    const input2 = this.createPageBlock('input', 'slider__input') as HTMLInputElement;
    input2.setAttribute('type', 'number');
    input2.setAttribute('min', min); //setup through promise
    input2.setAttribute('max', max); //setup through promise
    input2.setAttribute('value', max); //setup through promise
    input2.setAttribute('placeholder', max); //setup through promise
    input2.setAttribute('id', 'input2');
    span2.textContent = 'max: $';

    noUiSlider.create(sliderBody, {
      start: [min, max],
      connect: true,
      step: 1,
      range: {
          'min': [Number(min)],
          'max': [Number(max)]
      }
  });

  if ( sliderBody.noUiSlider) {
    sliderBody.noUiSlider.on('update', (values, handle: number) => {
      if (handle === 0) {
        input1.value = (Math.round(Number(values[handle]))).toString();
      }
      if (handle === 1) {
        input2.value = (Math.round(Number(values[handle]))).toString();
      }
    });
  }

  [input1, input2].forEach((input, handle) => {
    input.addEventListener('change', (e) => {
      let target = <HTMLInputElement>e.currentTarget;
      let targetValue = target.value;
      if (target) {
        if ( sliderBody.noUiSlider) {
          sliderBody.noUiSlider.setHandle(handle, targetValue);
        }
      }
    });
  })

    label1.append(...[span1, input1]);
    label2.append(...[span2, input2]);
    inputs.append(...[label1, label2]);
    slider.append(...[sliderBody, inputs]);
    filters.append(...[title, slider]);
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

    this.createMultiRangeSlider(filters, 'Price', '10', '1749');
    this.createMultiRangeSlider(filters, 'Stock', '2', '150');
    this.getCategories(filters);
    this.getBrand(filters);

    // this.createMultiRangeSlider(filters);

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

    // this.getProducts();

    return this.main;
  }
}

export default MainPage;
