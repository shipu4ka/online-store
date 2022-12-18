import Page from "../../models/templates/page";

class MainPage extends Page {
  static TextObject = {
    MainTitle: 'Home page'
  };

  constructor(id: string) {
    super(id);
  }

  async getProducts() {
    const data = await this.getPageData();
    return console.log(data.products);
  }

  render() {
    const title = this.createPageTitle(MainPage.TextObject.MainTitle);
    this.main?.append(title);

    this.getProducts()

    return this.main;
  }

}

export default MainPage;