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

  const btn = document.querySelector('.confirm__btn') as HTMLElement;
  const modal = document.querySelector('.modal') as HTMLElement;
  const form = document.querySelector('.confirm__form') as HTMLElement;

  btn.onclick = () => {
    if (document.querySelector('.confirm__check_error')) {
      return;
    }
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
    const value = target.value;
    const firstNumber = value.slice(0, 1);
    const regExp = /^[0-9]{16}$/;

    if (firstNumber === '4') {
      payment.style.backgroundImage = 'url(./assets/images/visa_logo.png)';
    } else if (firstNumber === '5') {
      payment.style.backgroundImage = 'url(./assets/images/master_card_logo.png)';
    } else if (firstNumber === '6') {
      payment.style.backgroundImage = 'url(./assets/images/maestro_logo.jpg)';
    } else {
      payment.style.backgroundImage = 'url(./assets/images/mir_logo.jpg)';
    }

    if (!regExp.test(value)) {
      card.parentElement?.classList.add('confirm__check_error');
    } else {
      card.parentElement?.classList.remove('confirm__check_error');
    }
  }

  name.oninput = (e) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    let isValid = true;
    if (value.split(' ').length < 2) {
      isValid = false;
    }
    value.split(' ').forEach((el) => {
      if (el.length < 3) {
        isValid = false;
      }
    })
    if (!isValid) {
      name.parentElement?.classList.add('confirm__check_error');
    } else {
      name.parentElement?.classList.remove('confirm__check_error');
    }
  }

  phone.oninput = (e) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    let isValid = true;
    const regExp = /^((\+)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{9,20}$/;
    if (!regExp.test(value)) {
      isValid = false;
    }
    if (!isValid) {
      phone.parentElement?.classList.add('confirm__check_error');
    } else {
      phone.parentElement?.classList.remove('confirm__check_error');
    }
  }

  email.oninput = (e) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    let isValid = true;
    const regExp = /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*/;
    if (!regExp.test(value)) {
      isValid = false;
    }
    if (!isValid) {
      email.parentElement?.classList.add('confirm__check_error');
    } else {
      email.parentElement?.classList.remove('confirm__check_error');
    }
  }

  delivery.oninput = (e) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    let isValid = true;
    if (value.split(' ').length < 3) {
      isValid = false;
    }
    value.split(' ').forEach((el) => {
      if (el.length < 5) {
        isValid = false;
      }
    })
    if (!isValid) {
      delivery.parentElement?.classList.add('confirm__check_error');
    } else {
      delivery.parentElement?.classList.remove('confirm__check_error');
    }
  }

  cvv.oninput = (e) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    const regExp = /^[0-9]{3}$/;
    if (!regExp.test(value)) {
      cvv.parentElement?.classList.add('confirm__check_error');
    } else {
      cvv.parentElement?.classList.remove('confirm__check_error');
    }
  }

  data.oninput = (e) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    const regExp = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!regExp.test(value)) {
      data.parentElement?.classList.add('confirm__check_error');
    } else {
      data.parentElement?.classList.remove('confirm__check_error');
    }
  }

}