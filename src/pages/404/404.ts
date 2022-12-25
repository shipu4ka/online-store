import Page from '../../models/templates/page';

export const enum ErrorTypes {
  Error404 = 404,
}
class ErrorPage extends Page {
  private errorType: ErrorTypes | string;

  static TextObject: { [prop: string]: string } = {
    '404': '404',
  };

  constructor(id: string, errorType: ErrorTypes | string) {
    super(id);
    this.errorType = errorType;
  }

  renderErrorPage() {
    const section = this.createPageBlock('section', 'error', 'container');

    const title = this.createPageTitle(ErrorPage.TextObject[this.errorType]);
    title.classList.add('error__title');

    const h2 = this.createPageBlock('h2', 'error__subtitle');
    h2.textContent = 'Uh-Oh...';

    const p = this.createPageBlock('p', 'error__text');
    p.textContent = 'The page you are looking for may have been moved, deleted, or possibly never existed';

    section.append(...[title, h2, p]);
    this.main?.append(section);
  }

  render() {
    this.renderErrorPage();
    return this.main;
  }
}

export default ErrorPage;
