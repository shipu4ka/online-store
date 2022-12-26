import Page from '../../models/templates/page';
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';

class MainPage extends Page {
  static TextObject = {
    MainTitle: 'All Categories',
    PriceUp: 'Price Range Up',
    PriceDown: 'Price Range Down',
    DiscountUp: 'Discount Range Up',
    DiscountDown: 'Discount Range Down',
    RatingUp: 'Rating Range Up',
    RatingDown: 'Rating Range Down',
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
    return data.products;
  }

  async getCategories(filters: HTMLElement) {
    const data = await this.getProductsCategories();
    const filterContainer = this.createPageBlock('div', 'filters__container');
    const title = this.createTitle('Category');
    const categories = this.createCategoriesBlock('filters__categories', 'filters__category', 'filters__total-category', data);
    filterContainer.append(...[title, categories]);
    filters.append(...[filterContainer]);
  }

  async getBrand(filters: HTMLElement) {
    const data = await this.getPageData();
    const filterContainer = this.createPageBlock('div', 'filters__container');
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

    // console.log(arrDataProducts);
    // console.log(uniqArrDataProducts);
    // console.log(objDataProducts);
    // console.log(uniq);

    filterContainer.append(...[title, brand]);
    filters.append(...[filterContainer]);
  }

  createMultiRangeSlider(filters: HTMLElement, titleNode: string, min: string, max: string) {
    const filterContainer = this.createPageBlock('div', 'filters__container');
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
    filterContainer.append(...[title, slider]);
    filters.append(...[filterContainer]);
  }

  createFiltersButtons(filters: HTMLElement) {
    const buttons = this.createPageBlock('div', 'filters__buttons');
    const btn1 = this.createPageBlock('button', 'filters__button');
    btn1.textContent = 'Reset Filters';
    const btn2 = this.createPageBlock('button', 'filters__button');
    btn2.textContent = 'Copy Link';
    buttons.append(...[btn1, btn2]);
    filters.append(...[buttons]);
  }

  createFilters() {
    const filters = this.createPageBlock('aside', 'filters');
    this.createFiltersButtons(filters);
    this.createMultiRangeSlider(filters, 'Price', '10', '1749');
    this.createMultiRangeSlider(filters, 'Stock', '2', '150');
    this.getCategories(filters);
    this.getBrand(filters);
    return filters;
  }

  createCardsSelect(sort: HTMLElement) {
    const select = this.createPageBlock('div', 'sort__select', 'select');
    const selectText = this.createPageBlock('span', 'select__text');
    selectText.textContent = 'Sort by:';
    const selectWrap = this.createPageBlock('div', 'select__wrap');
    const selectTag = this.createPageBlock('select', 'select__tag') as HTMLSelectElement;
    const option = this.createPageBlock('option', 'select__option');
    option.setAttribute('value', MainPage.TextObject.MainTitle);
    option.textContent = MainPage.TextObject.MainTitle;
    const option1 = this.createPageBlock('option', 'select__option');
    option1.setAttribute('value', MainPage.TextObject.PriceUp);
    option1.textContent = MainPage.TextObject.PriceUp;
    const option2 = this.createPageBlock('option', 'select__option');
    option2.setAttribute('value', MainPage.TextObject.PriceDown);
    option2.textContent = MainPage.TextObject.PriceDown;
    const option3 = this.createPageBlock('option', 'select__option');
    option3.setAttribute('value', MainPage.TextObject.DiscountUp);
    option3.textContent = MainPage.TextObject.DiscountUp;
    const option4 = this.createPageBlock('option', 'select__option');
    option4.setAttribute('value', MainPage.TextObject.DiscountDown);
    option4.textContent = MainPage.TextObject.DiscountDown;
    const option5 = this.createPageBlock('option', 'select__option');
    option5.setAttribute('value', MainPage.TextObject.RatingUp);
    option5.textContent = MainPage.TextObject.RatingUp;
    const option6 = this.createPageBlock('option', 'select__option');
    option6.setAttribute('value', MainPage.TextObject.RatingDown);
    option6.textContent = MainPage.TextObject.RatingDown;
    selectTag.append(...[option, option1, option2, option3, option4, option5, option6]);
    selectWrap.append(...[selectTag]);
    select.append(...[selectText, selectWrap]);
    sort.append(...[select]);

    if (selectTag.value) {
      selectTag.addEventListener('change', (e) => {
        const target = e.target as HTMLOptionElement;
        const title = document.querySelector('.cards__title') as HTMLElement;
        if (target && title) {
          let text = target.value;
          title.textContent = 'Sorted by ' + text;
          console.log(target.value);
        }
      })
    }
  }

  createFound(sort: HTMLElement) {
    const found = this.createPageBlock('div', 'cards__found');
    const foundText = this.createPageBlock('span', 'cards__found-text');
    foundText.textContent = 'Found:';
    const foundInfo = this.createPageBlock('span', 'cards__found-info');
    foundInfo.textContent = '100';
    found.append(...[foundText, foundInfo]);
    sort.append(...[found]);
  }

  createSearch(sort: HTMLElement) {
    const search = this.createPageBlock('div', 'cards__search');
    const searchInput = this.createPageBlock('input', 'cards__search-input');
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('placeholder', 'Search product');
    search.append(...[searchInput]);
    sort.append(...[search]);
  }

  createShowMore(sort: HTMLElement) {
    const show = this.createPageBlock('div', 'cards__show');
    const showText = this.createPageBlock('div', 'cards__show-text');
    showText.textContent = 'Show more';
    show.append(...[showText]);
    sort.append(...[show]);
  }

  createCardsSort(cards: HTMLElement) {
    const sort = this.createPageBlock('div', 'cards__sort', 'sort');

    this.createCardsSelect(sort);
    this.createFound(sort);
    this.createSearch(sort);
    this.createShowMore(sort);
    cards.append(...[sort]);
  }

  async createCardsProducts(cards: HTMLElement) {
    const cardsContainer = this.createPageBlock('div', 'cards__container');
    const title = this.createPageBlock('h1', 'cards__title', 'title');
    title.textContent = MainPage.TextObject.MainTitle;
    const cardsProducts = this.createPageBlock('div', 'cards__products', 'products');

    const data = await this.getPageData();
    const products = data.products;
    console.log(data);
    console.log(products);
    
    products.forEach((item) => {
      const card = this.createPageBlock('div', 'cards__card', 'products__card');
      const cardTitle = this.createPageBlock('h3', 'products__title');
      cardTitle.textContent = item.title;
      const cardItems = this.createPageBlock('div', 'products__items');
      const cardImage = this.createPageBlock('div', 'products__image');
      cardImage.style.background = `url('${item.images[0]}') 0 0/cover no-repeat`;
      const cardText = this.createPageBlock('div', 'products__text');
      const cardInfo = this.createPageBlock('div', 'products__info');
      const cardStock = this.createPageBlock('div', 'products__stock');
      cardStock.textContent = `Stock: ${item.stock}`;
      const cardPrice = this.createPageBlock('div', 'products__price');
      cardPrice.textContent = `Price: $ ${item.price}`;
      const cardDiscount = this.createPageBlock('div', 'products__discount');
      cardDiscount.textContent = `Discount: ${item.discountPercentage}%`;
      const cardButtons = this.createPageBlock('div', 'products__buttons');
      const cardButtonAdd = this.createPageBlock('button', 'products__button','products__add');
      cardButtonAdd.textContent = "Add to Cart";
      const cardButtonDetails = this.createPageBlock('button', 'products__button', 'products__details');
      cardButtonDetails.textContent = 'Details';

      cardButtons.append(...[cardButtonAdd, cardButtonDetails]);
      cardInfo.append(...[cardStock, cardPrice, cardDiscount]);
      cardText.append(...[cardInfo, cardButtons]);
      cardItems.append(...[cardImage, cardText]);
      card.append(...[cardTitle, cardItems]);
      cardsProducts.append(...[card]);
    })

    cardsContainer.append(...[title, cardsProducts]);
    cards.append(...[cardsContainer]);
  }

  createCads() {
    const cards = this.createPageBlock('section', 'cards');
    this.createCardsSort(cards);
    this.createCardsProducts(cards);
    return cards;
  }

  render() {
    const mainWrapper = this.createPageBlock('div', 'wrapper');
    const filters = this.createFilters();
    const cards = this.createCads();
    mainWrapper.append(...[cards, filters]);
    this.main?.append(mainWrapper);

    // this.getProducts();

    return this.main;
  }
}

export default MainPage;
