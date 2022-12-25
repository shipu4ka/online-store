import { Product } from "../../models/interfaces/productsList";
import Page from "../../models/templates/page";
import { fakeProduct } from "../description/description";

class CartPage extends Page {
  static TextObject = {
    MainTitle: 'Cart page',
  };

  constructor(id: string) {
    super(id);
  }

  renderCartPage(product: Product) {
    const section = this.createPageBlock('section', 'cart', 'container');

    const productsWrapper = this.createPageBlock('div', 'cart__products', 'products');

    const summarytWrapper = this.createPageBlock('div', 'cart__summary', 'summary');

    const productsHeader = this.createPageBlock('div', 'products__header', 'products-header');

    const productsList = this.createPageBlock('div', 'products__list', 'products-list');
    productsList.textContent = 'Cart is Empty';

    const title = this.createPageBlock('h2', 'products-header__title');
    title.textContent = 'Products in cart';

    const item = this.createPageBlock('label', 'products-header__parameter') as HTMLLabelElement;
    item.textContent = 'item:';
    item.htmlFor = 'item';

    const itemValue = this.createPageBlock('input', 'products-header__value') as HTMLInputElement;
    itemValue.id = 'item';
    itemValue.value = '0';
    itemValue.type = 'number';

    const pagination = this.createPageBlock('label', 'products-header__parameter') as HTMLLabelElement;
    pagination.textContent = 'page:';
    item.htmlFor = 'pagination';

    const btnArrow1 = this.createPageBlock('img', 'products-header__arrow') as HTMLImageElement;
    btnArrow1.src = '../assets/icons/arrow_reverse.svg';
    btnArrow1.alt = 'Arrow';


    const pages = this.createPageBlock('input', 'products-header__pages') as HTMLInputElement;
    pages.id = 'pagination';
    pages.value = '1/1';
    pages.disabled = true;

    const btnArrow2 = this.createPageBlock('img', 'products-header__arrow') as HTMLImageElement;
    btnArrow2.src = '../assets/icons/arrow.svg';
    btnArrow2.alt = 'Arrow';

    const summaryHeader = this.createPageBlock('h2', 'summary__title');
    summaryHeader.textContent = 'Summary';

    const qtyProducts = this.createPageBlock('p', 'summary__item');
    qtyProducts.textContent = 'Products:';

    const qtyValue = this.createPageBlock('div', 'summary__quantity');
    qtyValue.textContent = '0';

    const total = this.createPageBlock('p', 'summary__item');
    total.textContent = 'Total:';

    const totalValue = this.createPageBlock('div', 'summary__amount');
    totalValue.textContent = '$ 0';

    const promoBlock = this.createPageBlock('div', 'summary__promo', 'promo-block');

    const btnBuyNow = this.createPageBlock('button', 'summary__buy');
    btnBuyNow.textContent = 'Buy now';

    const enteringPromoCode = this.createPageBlock('input', 'promo-block__code') as HTMLInputElement;
    enteringPromoCode.placeholder = 'Enter promo code';
    enteringPromoCode.type = 'string';

    const codeOptions = this.createPageBlock('p', 'promo-block__options');
    codeOptions.textContent = "Available promo codes: 'rs', 'sale'.";



    promoBlock.append(...[enteringPromoCode, codeOptions]);
    summarytWrapper.append(...[summaryHeader, qtyProducts, qtyValue, total, totalValue, promoBlock, btnBuyNow]);
    productsHeader.append(...[title, item, itemValue, pagination, btnArrow1, pages, btnArrow2]);
    productsWrapper.append(...[productsHeader, productsList]);
    section.append(...[productsWrapper, summarytWrapper]);
    this.main?.append(section);

  }

  render() {
   this.renderCartPage(fakeProduct);
    return this.main;
  }
}

export default CartPage;
