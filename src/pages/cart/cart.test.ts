import CartPage from "./cart";

describe('test CartPage', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main class="content"></main> <section class="modal"></section>';
    const page = new CartPage('cart-page');
    page.render();
  })
  
  test('test render header', () => {    
    const productsHeader = document.querySelector('.cart-products__header');
    expect(productsHeader).not.toBeNull();
  });
  
  test('test buy now button', () => {
    const btn = document.querySelector('.summary__buy') as HTMLButtonElement;
    const modal = document.querySelector('.modal') as HTMLElement;
    expect(modal?.style.display).toBe('');
    
    btn.click();
    expect(modal?.style.display).toBe('block');
  })

  test('test enter promo code', () => {
    const input = document.querySelector('.promo-block__code') as HTMLInputElement;
    const promoBlock = document.querySelector('.promo-block__discount');
    expect(promoBlock?.classList.contains('promo-block__item_hidden')).toBeTruthy();
    expect(input).toBeTruthy();
  })

})