abstract class Component {
  protected element: HTMLElement;

  constructor(className: string) {
    this.element = document.querySelector(`.${className}`)!;
  }

  render() {
    return this.element;
  }
}

export default Component;