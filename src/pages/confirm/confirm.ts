import { PageIds } from "../../models/app/app";
import { LocalStorageKey } from "../../models/enums/products";

export function listener() {
  const name = document.getElementById('name') as HTMLInputElement;
  const phone = document.getElementById('phone') as HTMLInputElement;
  const email = document.getElementById('email') as HTMLInputElement;
  const delivery = document.getElementById('delivery') as HTMLInputElement;
  const card = document.getElementById('card') as HTMLInputElement;
  const data = document.getElementById('data') as HTMLInputElement;
  const cvv = document.getElementById('cvv') as HTMLInputElement;
  const payment = document.querySelector('.credit-details__payment') as HTMLElement;

  // нужно написать валидацию для всех полей

  const btn = document.querySelector('.confirm__btn') as HTMLElement;
  const modal = document.querySelector('.modal') as HTMLElement;
  const form = document.querySelector('.confirm__form') as HTMLElement;

  btn.onclick = () => {
    const tmp = form.innerHTML;
    form.innerHTML = 'Your order has been processed and shipped. Expect delivery.';
    form.style.textAlign = 'center';
    form.style.paddingTop = '10px';
    btn.style.display = 'none';
    setTimeout(() => {
      window.location.hash = PageIds.MainPage;
      localStorage.setItem(LocalStorageKey.productsInCart, '');
      localStorage.setItem(LocalStorageKey.arrDiscount, '');
      const cart = document.querySelector('.header__total');
      const total = document.querySelector('.header__sum-total');
      (cart as HTMLElement).textContent = '0';
      (total as HTMLElement).textContent = '0';
      form.innerHTML = tmp;
      form.style.textAlign = 'left';
      form.style.paddingTop = '0';
      btn.style.display = 'block';
      modal.style.display = 'none';
    }, 3000)
  }

  card.oninput = (e) => {
    const target = e.target as HTMLInputElement;
    const firstNumber = target.value.slice(0, 1);
    
    if (firstNumber === '4') {
      payment.style.backgroundImage = 'url(./assets/images/visa_logo.png)';
    } else if (firstNumber === '5') {
      payment.style.backgroundImage = 'url(./assets/images/master_card_logo.png)';
    } else if (firstNumber === '6') {
      payment.style.backgroundImage = 'url(./assets/images/maestro_logo.jpg)';
    } else {
      payment.style.backgroundImage = 'url(./assets/images/mir_logo.jpg)';
    }
  }
}