abstract class Page {
  protected main: HTMLElement;
  static TextObject = {};

  constructor(id: string) {
    this.main = document.querySelector('.content')!;
    if (this.main) {
      this.main.id = id;
    }
  }

  protected createPageTitle(title: string) {
    const mainTitle= document.createElement('h1');
    mainTitle.innerText = title;
    return mainTitle;
  }

  render() {
    return this.main;
  }
}

export default Page;