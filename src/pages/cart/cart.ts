import { Product, ProductInCart } from "../../models/interfaces/productsList";
import Page from "../../models/templates/page";

class CartPage extends Page {

  static arrDiscount: string[] = [];

  constructor(id: string) {
    super(id);
  }

  renderCartPage() {
    const section = this.createPageBlock('section', 'cart');

    const productsWrapper = this.createPageBlock('div', 'cart__products', 'cart-products');

    const summarytWrapper = this.createPageBlock('div', 'cart__summary', 'summary');

    const productsHeader = this.createPageBlock('div', 'cart-products__header', 'products-header');

    const productsList = this.createPageBlock('div', 'cart-products__list', 'products-list');

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
    const productsInCart = JSON.parse(localStorage.getItem('products_in_cart') || '[]');
    qtyValue.textContent = productsInCart.length;

    const total = this.createPageBlock('p', 'summary__item');
    total.textContent = 'Total:';

    const totalValue = this.createPageBlock('div', 'summary__amount');
    const totalCost = productsInCart.reduce((acc: number, product: Product) => acc + product.price, 0);
    const discountedAmount = this.createPageBlock('span', 'summary__discount');
    discountedAmount.textContent = totalCost;

    total.append(discountedAmount);

    const recalculationAmount = () => {
      if (CartPage.arrDiscount.length === 0) {
        discountedAmount.classList.add('summary__discount_hidden');
        totalValue.textContent = `$ ${totalCost}`;
        totalValue.style.textDecoration = 'none';
      } else {
        discountedAmount.classList.remove('summary__discount_hidden');
        discountedAmount.textContent = `$ ${Math.round(totalCost * (1 - 0.1 * CartPage.arrDiscount.length))}`;
        totalValue.style.textDecoration = 'line-through';
      }
    }
    recalculationAmount();

    const promoBlock = this.createPageBlock('div', 'summary__promo', 'promo-block');

    const btnBuyNow = this.createPageBlock('button', 'summary__buy');
    btnBuyNow.textContent = 'Buy now';

    const enteringPromoCode = this.createPageBlock('input', 'promo-block__code') as HTMLInputElement;
    enteringPromoCode.placeholder = 'Enter promo code';
    enteringPromoCode.type = 'string';
    enteringPromoCode.oninput = (e) => {
      const target = e.target as HTMLInputElement;
      const valueCode = target.value;
      if (valueCode === 'rs' || valueCode === 'sale') {
        document.querySelector('.promo-block__discount')?.classList.remove('promo-block__item_hidden');
        document.querySelector('.promo-block__options')?.classList.add('promo-block__item_hidden');
      } else {
        amountDiscount.classList.add('promo-block__item_hidden');
        codeOptions.classList.remove('promo-block__item_hidden');
      }
    }

    const codeOptions = this.createPageBlock('p', 'promo-block__options');
    codeOptions.textContent = "Available promo codes: 'rs', 'sale'.";

    const amountDiscount = this.createPageBlock('div', 'promo-block__discount', 'promo-block__item_hidden');
    amountDiscount.textContent = 'Your discount will be 10%';


    const appliedBlock = this.createPageBlock('div', 'summary__applied', 'applied-block');
    appliedBlock.classList.add('applied-block_hidden');

    const codesList = this.createPageBlock('ul', 'applied-block__list');

    const appliedTitle = this.createPageBlock('h3', 'applied-block__title');
    appliedTitle.textContent = 'Applied codes:'

    const btnAddDiscount = this.createPageBlock('button', 'promo-block__btn');
    btnAddDiscount.textContent = 'add';
    btnAddDiscount.onclick = () => {
      appliedBlock.classList.remove('applied-block_hidden');
      if (!CartPage.arrDiscount.includes(enteringPromoCode.value)) {
        CartPage.arrDiscount.push(enteringPromoCode.value);
      }
      amountDiscount.classList.add('promo-block__item_hidden');
      codeOptions.classList.remove('promo-block__item_hidden');
      renderDiscount();
      recalculationAmount();
    };

    const renderDiscount = () => {
      codesList.innerHTML = '';
      CartPage.arrDiscount.forEach((item) => {
        const appliedCode = this.createPageBlock('li', 'applied-block__code');
        appliedCode.textContent = `${item} -10%`;

        const btnDropDiscount = this.createPageBlock('button', 'applied-block__btn');
        btnDropDiscount.textContent = 'drop';

        appliedCode.append(btnDropDiscount);
        codesList.append(appliedCode);

        enteringPromoCode.value = '';

        btnDropDiscount.onclick = () => {
          CartPage.arrDiscount = CartPage.arrDiscount.filter((el) => el !== item);

          if (CartPage.arrDiscount.length === 0) {
            appliedBlock.classList.add('applied-block_hidden');
          }
          renderDiscount();
          recalculationAmount();
        }
      })
    }

    const productsListInCart: any = {};
    let count = 1;

    const sortedProducts = productsInCart.sort((a: Product, b: Product) => a.id - b.id);
    sortedProducts.forEach((item: ProductInCart) => {
      if (item.id in productsListInCart) {
        count += 1;
        productsListInCart[item.id] = { count: count, product: item };
      } else {
        count = 1;
        productsListInCart[item.id] = { count: count, product: item };
      }
    })

    const idProductList = Object.keys(productsListInCart);
    
    console.log(idProductList);


    const renderProductList = () => {
      if (idProductList.length === 0) {
        productsList.textContent = 'Cart is Empty';
      } else {
        for (let i = 1; i <= idProductList.length; i++) {
          const product = productsListInCart[idProductList[i - 1]];
          const infoProduct = product.product;

          const productInCart = this.createPageBlock('div', 'product-list__item');

          const index = this.createPageBlock('p', 'product-list__index');
          index.textContent = `${i}`;

          const photoProductInCart = this.createPageBlock('img', 'product-list__photo') as HTMLImageElement;
          photoProductInCart.src = infoProduct.images[0];
          photoProductInCart.alt = 'Photo product';

          const wrapperDesc = this.createPageBlock('div', 'product-list__wrap', 'wrap-desc');

          const wrapperQty = this.createPageBlock('div', 'product-list__wrap', 'wrap-qty');

          const descTitle = this.createPageBlock('h3', 'product-list__title');
          descTitle.textContent = infoProduct.title;

          const descInfo = this.createPageBlock('div', 'product-list__info');
          descInfo.textContent = infoProduct.description;

          const descRating = this.createPageBlock('p', 'product-list__rating');
          descRating.textContent = `Rating: ${infoProduct.rating}`;

          const descDiscount = this.createPageBlock('p', 'product-list__discount');
          descDiscount.textContent = `Discount: ${infoProduct.discountPercentage}`;

          const qtyStock = this.createPageBlock('p', 'product-list__stock');
          qtyStock.textContent = `Stock: ${infoProduct.stock}`;

          const btnPlus = this.createPageBlock('button', 'product-list__btn');
          btnPlus.textContent = '+';

          const selectedQty = this.createPageBlock('p', 'product-list__qty');
          selectedQty.textContent = product.count;

          const btnMinus = this.createPageBlock('button', 'product-list__btn');
          btnMinus.textContent = '-';

          const totalInCart = this.createPageBlock('p', 'product-list__total');
          totalInCart.textContent = `Total: ${infoProduct.price * product.count}`;

          wrapperQty.append(...[qtyStock, btnPlus, selectedQty, btnMinus, totalInCart]);
          wrapperDesc.append(...[descTitle, descInfo, descRating, descDiscount]);
          productInCart.append(...[index, photoProductInCart, wrapperDesc, wrapperQty]);
          productsList.append(productInCart);
        }
      }
    }

    renderProductList();


    console.log(sortedProducts);
    console.log(productsListInCart);



    appliedBlock.append(...[appliedTitle, codesList]);
    amountDiscount.append(btnAddDiscount);
    promoBlock.append(...[enteringPromoCode, codeOptions, amountDiscount]);
    summarytWrapper.append(...[summaryHeader, qtyProducts, qtyValue, total, totalValue, appliedBlock, promoBlock, btnBuyNow]);
    productsHeader.append(...[title, item, itemValue, pagination, btnArrow1, pages, btnArrow2]);
    productsWrapper.append(...[productsHeader, productsList]);
    section.append(...[productsWrapper, summarytWrapper]);
    this.main?.append(section);

  }

  render() {
    this.renderCartPage();
    return this.main;
  }
}

export default CartPage;
