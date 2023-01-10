abstract class Component {
  protected element: HTMLElement;

  constructor(className: string) {
    this.element = document.querySelector(`.${className}`)!;
  }

  createComponentBlock(tag: string, className: string) {
    const block = document.createElement(tag);
    block.classList.add(className);
    return block;
  }

  render() {
    return this.element;
  }
}

export default Component;
