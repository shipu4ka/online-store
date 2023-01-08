import { LocalStorageKey } from "../../models/enums/products";
import { Product, ProductInCart } from "../../models/interfaces/productsList";
import Page from "../../models/templates/page";

interface ProductsInCart {
  [key: string]: ObjInCart
}

export interface ObjInCart {
  count: number;
  product: Product;
}

class CartPage extends Page {


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
    item.textContent = 'limit:';
    item.htmlFor = 'item';

    let limit = localStorage.getItem(LocalStorageKey.limit) || 3;
    let offset = 0;
    const itemValue = this.createPageBlock('input', 'products-header__value') as HTMLInputElement;
    itemValue.id = 'item';
    itemValue.value = String(limit);
    itemValue.type = 'number';
    itemValue.oninput = (e) => {
      const target = e.target as HTMLInputElement;
      localStorage.setItem(LocalStorageKey.limit, target.value);
      renderProductList();
    }

    const pagination = this.createPageBlock('label', 'products-header__parameter') as HTMLLabelElement;
    pagination.textContent = 'page:';
    item.htmlFor = 'pagination';

    const btnArrow1 = this.createPageBlock('img', 'products-header__arrow') as HTMLImageElement;
    btnArrow1.src = '../assets/icons/arrow_reverse.svg';
    btnArrow1.alt = 'Arrow';
    btnArrow1.onclick = () => {
      let currentPage = localStorage.getItem(LocalStorageKey.currentPage) || 1;
      if (currentPage > 1) {
        const nextPage = Number(currentPage) - 1;
        localStorage.setItem(LocalStorageKey.currentPage, `${nextPage}`);
        renderProductList();
      }
    }

    const pages = this.createPageBlock('input', 'products-header__pages') as HTMLInputElement;
    pages.id = 'pagination';
    pages.disabled = true;

    const btnArrow2 = this.createPageBlock('img', 'products-header__arrow') as HTMLImageElement;
    btnArrow2.src = '../assets/icons/arrow.svg';
    btnArrow2.alt = 'Arrow';
    btnArrow2.onclick = () => {
      let currentPage = localStorage.getItem(LocalStorageKey.currentPage) || 1;
      if (currentPage < calcMaxPage()) {
        const nextPage = Number(currentPage) + 1;
        localStorage.setItem(LocalStorageKey.currentPage, `${nextPage}`);
        renderProductList();
      }
    }

    const summaryHeader = this.createPageBlock('h2', 'summary__title');
    summaryHeader.textContent = 'Summary';

    const qtyProducts = this.createPageBlock('p', 'summary__item');
    qtyProducts.textContent = 'Products:';

    const qtyValue = this.createPageBlock('div', 'summary__quantity');
    const productsInCart = JSON.parse(localStorage.getItem(LocalStorageKey.productsInCart) || '{}');
    const arrValue = Object.values(productsInCart) as ObjInCart[];
    const totalQty = arrValue.reduce((acc: number, item: ObjInCart) => acc + item.count, 0);
    qtyValue.textContent = String(totalQty);

    const total = this.createPageBlock('p', 'summary__item');
    total.textContent = 'Total:';

    const totalValue = this.createPageBlock('div', 'summary__amount');
    const totalCost = arrValue.reduce((acc: number, item: ObjInCart) => acc + (item.count * item.product.price), 0);
    totalValue.textContent = `$${totalCost}`;

    const discountedAmount = this.createPageBlock('span', 'summary__discount');

    const recalculationAmount = () => {
      const arrDiscount: string[] = JSON.parse(localStorage.getItem(LocalStorageKey.arrDiscount) || '[]');
      const productsInCart = JSON.parse(localStorage.getItem(LocalStorageKey.productsInCart) || '{}');
      const arrValue = Object.values(productsInCart) as ObjInCart[];
      const totalCost = arrValue.reduce((acc: number, item: ObjInCart) => acc + (item.count * item.product.price), 0);
      if (arrDiscount.length === 0) {
        discountedAmount.classList.add('summary__discount_hidden');
        totalValue.textContent = `$${totalCost}`;
        totalValue.style.textDecoration = 'none';
      } else {
        discountedAmount.classList.remove('summary__discount_hidden');
        discountedAmount.textContent = `$${Math.round(totalCost * (1 - 0.1 * arrDiscount.length))}`;
        totalValue.textContent = `$${totalCost}`;
        totalValue.style.textDecoration = 'line-through';
      }
    }
    recalculationAmount();

    const promoBlock = this.createPageBlock('div', 'summary__promo', 'promo-block');

    const btnBuyNow = this.createPageBlock('button', 'summary__buy');
    btnBuyNow.textContent = 'Buy now';
    btnBuyNow.onclick = () => {
      const modal = document.querySelector('.modal') as HTMLElement;
      modal.style.display = 'block';
    }

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
      const arrDiscount: string[] = JSON.parse(localStorage.getItem(LocalStorageKey.arrDiscount) || '[]');
      appliedBlock.classList.remove('applied-block_hidden');
      if (!arrDiscount.includes(enteringPromoCode.value)) {
        arrDiscount.push(enteringPromoCode.value);
        localStorage.setItem(LocalStorageKey.arrDiscount, JSON.stringify(arrDiscount));
      }
      amountDiscount.classList.add('promo-block__item_hidden');
      codeOptions.classList.remove('promo-block__item_hidden');
      renderDiscount();
      recalculationAmount();
    };

    const renderDiscount = () => {
      const arrDiscount: string[] = JSON.parse(localStorage.getItem(LocalStorageKey.arrDiscount) || '[]');

      codesList.innerHTML = '';
      arrDiscount.forEach((item) => {
        const appliedCode = this.createPageBlock('li', 'applied-block__code');
        appliedCode.textContent = `${item} -10%`;

        const btnDropDiscount = this.createPageBlock('button', 'applied-block__btn');
        btnDropDiscount.textContent = 'drop';

        appliedCode.append(btnDropDiscount);
        codesList.append(appliedCode);

        enteringPromoCode.value = '';

        appliedBlock.classList.remove('applied-block_hidden');

        btnDropDiscount.onclick = () => {
          let arrDiscount: string[] = JSON.parse(localStorage.getItem(LocalStorageKey.arrDiscount) || '[]');

          arrDiscount = arrDiscount.filter((el) => el !== item);
          localStorage.setItem(LocalStorageKey.arrDiscount, JSON.stringify(arrDiscount));

          if (arrDiscount.length === 0) {
            appliedBlock.classList.add('applied-block_hidden');
          }
          renderDiscount();
          recalculationAmount();
        }
      })
    }
    renderDiscount();

    const calcMaxPage = () => {
      const productsInCart = JSON.parse(localStorage.getItem(LocalStorageKey.productsInCart) || '{}');
      const limit = localStorage.getItem(LocalStorageKey.limit) || 3;
      const idProductsList = Object.keys(productsInCart);
      const maxPage = Math.ceil(idProductsList.length / Number(limit));
      return maxPage;
    }

    const renderProductList = () => {
      const productsInCart = JSON.parse(localStorage.getItem(LocalStorageKey.productsInCart) || '{}');
      productsList.innerHTML = '';
      const limit = localStorage.getItem(LocalStorageKey.limit) || 3;
      const maxPage = calcMaxPage();
      let currentPage = localStorage.getItem(LocalStorageKey.currentPage) || 1;
      if (currentPage > maxPage) {
        currentPage = maxPage;
      }
      pages.value = `${currentPage}/${maxPage}`;
      
      const idProductsList = Object.keys(productsInCart);
      if (idProductsList.length === 0) {
        productsList.textContent = 'Cart is Empty';
        productsList.style.textAlign = 'center';
      } else {
        offset = (Number(currentPage) - 1) * Number(limit);
        let end = offset + Number(limit);
        if (end > idProductsList.length) {
          end = idProductsList.length
        }

        for (let i = offset; i < end; i++) {
          const productsInCart = JSON.parse(localStorage.getItem(LocalStorageKey.productsInCart) || '{}');

          const product = productsInCart[idProductsList[i]];
          const infoProduct = product.product;

          const productInCart = this.createPageBlock('div', 'product-list__item');

          const index = this.createPageBlock('p', 'product-list__index');
          index.textContent = `${i + 1}`;

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

          const changeSummary = (type: string) => {
            const productsInCart = JSON.parse(localStorage.getItem(LocalStorageKey.productsInCart) || '{}');
            
            if (type === 'add') {
              productsInCart[infoProduct.id].count += 1;
            }
            if (type === 'drop') {
              if (productsInCart[infoProduct.id].count > 1) {
                productsInCart[infoProduct.id].count -= 1;
              } else {
              delete productsInCart[infoProduct.id];
              renderProductList();
              }
            }
            localStorage.setItem(LocalStorageKey.productsInCart, JSON.stringify(productsInCart));
            const arrValue = Object.values(productsInCart) as ObjInCart[];
            const totalCost = arrValue.reduce((acc: number, item: ObjInCart) => acc + (item.count * item.product.price), 0);
            totalValue.textContent = `$${totalCost}`;
            const totalQty = arrValue.reduce((acc: number, item: ObjInCart) => acc + item.count, 0);
            qtyValue.textContent = String(totalQty);
            const cart = document.querySelector('.header__total');
            const total = document.querySelector('.header__sum-total');
            (cart as HTMLElement).textContent = String(totalQty);
            (total as HTMLElement).textContent = String(totalCost);
          }

          btnPlus.onclick = () => {
            if (product.count < infoProduct.stock) {
              changeSummary('add');
              renderProductList();
              recalculationAmount();
            }
          }

          const selectedQty = this.createPageBlock('p', 'product-list__qty');
          selectedQty.textContent = String(product.count);

          const btnMinus = this.createPageBlock('button', 'product-list__btn');
          btnMinus.textContent = '-';
          btnMinus.onclick = () => {
              changeSummary('drop');
              renderProductList();
              recalculationAmount();
          }

          const totalInCart = this.createPageBlock('p', 'product-list__total');
          totalInCart.textContent = `Total: $${infoProduct.price * product.count}`;

          wrapperQty.append(...[qtyStock, btnMinus, selectedQty, btnPlus, totalInCart]);
          wrapperDesc.append(...[descTitle, descInfo, descRating, descDiscount]);
          productInCart.append(...[index, photoProductInCart, wrapperDesc, wrapperQty]);
          productsList.append(productInCart);
        }
      }
    }

    renderProductList();

    appliedBlock.append(...[appliedTitle, codesList]);
    amountDiscount.append(btnAddDiscount);
    promoBlock.append(...[enteringPromoCode, codeOptions, amountDiscount]);
    summarytWrapper.append(...[summaryHeader, qtyProducts, qtyValue, discountedAmount, total, totalValue, appliedBlock, promoBlock, btnBuyNow]);
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
