import Page from "../../models/templates/page";

class ConfirmPage extends Page {
  static TextObject = {
    MainTitle: 'Confirm page'
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createPageTitle(ConfirmPage.TextObject.MainTitle);
    this.main?.append(title);
    return this.main;
  }

}

export default ConfirmPage;