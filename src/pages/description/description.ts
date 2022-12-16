import Page from "../../models/templates/page";

class DescriptionPage extends Page {
  static TextObject = {
    MainTitle: 'Description page'
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createPageTitle(DescriptionPage.TextObject.MainTitle);
    this.main?.append(title);
    return this.main;
  }

}

export default DescriptionPage;