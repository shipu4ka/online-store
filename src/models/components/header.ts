import Component from '../templates/components';
import { PageIds } from '../app/app';
import { Product } from '../interfaces/productsList';
import { ObjInCart } from '../../pages/cart/cart';
import { LocalStorageKey } from '../enums/products';

const Navigation = [
  {
    id: PageIds.MainPage,
    text: '<img src="../../assets/icons/logo.svg" alt="Home page">',
  },
  {
    id: PageIds.ConfirmPage,
    text: 'Confirm',
  },
  {
    id: PageIds.CartPage,
    text: '<img src="../../assets/icons/cart_empty.svg" alt="Cart">',
  },
];

class Header extends Component {
  constructor(className: string) {
    super(className);
  }

  createNavElement(item: number) {
    const elem = this.createComponentBlock('a', 'header__link') as HTMLLinkElement;
    elem.href = `#${Navigation[item].id}`;
    elem.innerHTML = Navigation[item].text;
    return elem;
  }

  renderPageNav() {
    const productsInCart = JSON.parse(localStorage.getItem(LocalStorageKey.productsInCart) || '{}');
    const arrValue = Object.values(productsInCart) as ObjInCart[];

    const totalCost = arrValue.reduce((acc: number, item: ObjInCart) => acc + (item.count * item.product.price), 0);
    const totalQty = arrValue.reduce((acc: number, item: ObjInCart) => acc + item.count, 0);

    const pageNav = document.createElement('nav');
    pageNav.classList.add('header__nav');
    pageNav.classList.add('container');

    const logo = this.createNavElement(0);
    const cart = this.createNavElement(2);

    const sumBlock = this.createComponentBlock('div', 'header__sum');
    const sumText = this.createComponentBlock('span', 'header__sum-text');
    const sum = this.createComponentBlock('span', 'header__sum-total');
    sumText.textContent = 'Cart total: $';
    
    sum.textContent = String(totalCost);
    sumBlock.append(...[sumText, sum]);

    const total = this.createComponentBlock('div', 'header__total');
    
    total.textContent = String(totalQty);

    pageNav.append(...[logo, sumBlock, cart, total]);

    this.element.append(pageNav);
  }

  render() {
    this.renderPageNav();
    return this.element;
  }
}
export default Header;
