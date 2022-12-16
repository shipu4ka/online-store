import Page from "../../models/templates/page";

class MainPage extends Page {
  static TextObject = {
    MainTitle: 'Home page'
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createPageTitle(MainPage.TextObject.MainTitle);
    this.main?.append(title);
    return this.main;
  }

}

export default MainPage;