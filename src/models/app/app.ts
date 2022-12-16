import Page from '../templates/page';
import MainPage from '../../pages/main/main';
import DescriptionPage from '../../pages/description/description';
import ConfirmPage from '../../pages/confirm/confirm';
import CartPage from '../../pages/cart/cart';
import Header from '../components/header';
import ErrorPage, { ErrorTypes } from '../../pages/404/404';

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

  static renderNewPage(idPage: string) {
    const content = document.querySelector('.content')!;
    if (content) {
      content.innerHTML = '';
    }

    let page: Page | null = null;

    if (idPage === PageIds.MainPage) {
      page = new MainPage(idPage);
    } else if (idPage === PageIds.DescriptionPage) {
      page = new DescriptionPage(idPage);
    } else if (idPage === PageIds.ConfirmPage) {
      page = new ConfirmPage(idPage);
    } else if (idPage === PageIds.CartPage) {
      page = new CartPage(idPage);
    } else {
      page = new ErrorPage(idPage, ErrorTypes.Error404);
    }

    if (page && content) {
      const pageHTML = page.render();
      return pageHTML;
    }
  }

  private enableRouteChange() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      App.renderNewPage(hash);
    });
  }

  constructor() {
    this.initialPage = new MainPage('main-page');
    this.header = new Header('header');
  }

  run() {
    if (App.root && this.initialPage) {
      App.renderNewPage('main-page');
      this.header.render();
      this.enableRouteChange();
    }
  }
}

//main, description, confirm, cart, 404

export default App;