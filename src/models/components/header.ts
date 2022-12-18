import Component from '../templates/components';
import { PageIds } from '../app/app';

const Navigation = [
  {
    id: PageIds.MainPage,
    text: '<img src="../../assets/icons/logo.svg" alt="Home page">',
  },
  {
    id: PageIds.DescriptionPage,
    text: 'Description',
  },
  {
    id: PageIds.ConfirmPage,
    text: 'Confirm',
  },
  {
    id: PageIds.CartPage,
    text: '<img src="../../assets/icons/cart_empty.svg" alt="Cart">',
  }
]

class Header extends Component {
  constructor(className: string) {
    super(className);
  }

  renderPageNav() {
    const pageNav = document.createElement('nav');
    pageNav.classList.add('header__nav');
    pageNav.classList.add('container');

    Navigation.forEach((item) => {
      const navItem = document.createElement('a');
      navItem.classList.add('header__link');
      navItem.href = `#${item.id}`;
      navItem.innerHTML = item.text;
      pageNav.append(navItem);
    });

    this.element.append(pageNav);

    const total = this.createComponentBlock('div', 'header__total');
    total.textContent = '0';
    pageNav.append(total);
  }

  render() {
    this.renderPageNav();
    return this.element;
  }
}
export default Header;