import Page from "../../models/templates/page";

export const enum ErrorTypes {
  Error404 = 404,
}
class ErrorPage extends Page {
  private errorType: ErrorTypes | string;

  static TextObject: { [prop: string]: string } = {
    '404': '404 Ops! The page is not found!'
  };

  constructor(id: string, errorType: ErrorTypes | string) {
    super(id);
    this.errorType = errorType;
  }

  render() {
    const title = this.createPageTitle(ErrorPage.TextObject[this.errorType]);
    this.main?.append(title);
    return this.main;
  }
}

export default ErrorPage;