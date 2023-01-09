import Page from '../templates/page';
import MainPage from '../../pages/main/main';
import DescriptionPage from '../../pages/description/description';
import CartPage from '../../pages/cart/cart';
import Header from '../components/header';
import ErrorPage, { ErrorTypes } from '../../pages/404/404';
import Footer from '../components/footer';
import { Filters } from '../enums/filters';
import { listener } from '../../pages/confirm/confirm';

export const enum PageIds {
  MainPage = 'main-page',
  DescriptionPage = 'description-page',
  ConfirmPage = 'confirm-page',
  CartPage = 'cart-page',
}

class App {
  private static root: HTMLElement = document.querySelector('.root')!;
  private initialPage: MainPage;
  private header: Header;
  private footer: Footer;

  static renderNewPage() {
    const content = document.querySelector('.content')!;
    if (content) {
      content.innerHTML = '';
    }
    const hash = window.location.hash.slice(1);

    let page: Page | null = null;
    const arrIdPage = hash.split('/');

    function getFilterHash(arrIdPage: Array<string>) {
      const lastItem = arrIdPage[arrIdPage.length - 1];
      switch(lastItem) {
        case PageIds.MainPage: 
        case Filters.Default: 
        case Filters.PriceUp: 
        case Filters.PriceDown: 
        case Filters.DiscountUp: 
        case Filters.DiscountDown: 
        case Filters.RatingUp: 
        case Filters.RatingDown: 
          page = new MainPage(hash);
          break
        default:
          page = new ErrorPage(hash, ErrorTypes.Error404);
      }
    }


    if (arrIdPage[0] === '') {
      page = new MainPage(hash);
    } else if(arrIdPage[0] === PageIds.MainPage) {
      getFilterHash(arrIdPage);
    } else if (arrIdPage[0] === PageIds.DescriptionPage) {
      page = new DescriptionPage(arrIdPage[0], arrIdPage[1]);
    } else if (hash === PageIds.CartPage) {
      page = new CartPage(hash);
    } else {
      page = new ErrorPage(hash, ErrorTypes.Error404);
    }

    if (page && content) {
      const pageHTML = page.render();
      return pageHTML;
    }
  }

  private enableRouteChange() {
    window.addEventListener('hashchange', () => {
      App.renderNewPage();
    });
  }

  constructor() {
    this.initialPage = new MainPage('main-page');
    this.header = new Header('header');
    this.footer = new Footer('footer');
  }

  run() {
    if (App.root && this.initialPage) {
      App.renderNewPage();
      this.header.render();
      this.footer.render();
      this.enableRouteChange();
      listener();
    }
  }
}

//main, description, confirm, cart, 404

export default App;
