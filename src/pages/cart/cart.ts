import Page from "../../models/templates/page";

class CartPage extends Page {
  static TextObject = {
    MainTitle: 'Cart page'
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createPageTitle(CartPage.TextObject.MainTitle);
    this.main?.append(title);
    return this.main;
  }

}

export default CartPage;