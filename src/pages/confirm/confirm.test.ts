import { listener } from "./confirm";

describe('test confirmPage', () => {
    beforeEach(() => {
        document.body.innerHTML = `<section class="modal">
        <div class="confirm">
          <form class="confirm__form">
            <fieldset class="confirm__item personal-details">
              <legend class="confirm__title">Personal details</legend>
              <ul class="confirm__details">
                <li class="personal-details__item">
                  <label class="confirm__label" for="name">Full name:</label>
                  <input class="personal-details__input" type="text" id="name">
                  <div class="confirm__check">Error</div>
                </li>
                <li class="personal-details__item">
                  <label class="confirm__label" for="phone">Phone number:</label>
                  <input class="personal-details__input" type="number" id="phone">
                  <div class="confirm__check">Error</div>
                </li>
                <li class="personal-details__item">
                  <label class="confirm__label" for="email">Email:</label>
                  <input class="personal-details__input" type="email" id="email">
                  <div class="confirm__check">Error</div>
                </li>
                <li class="personal-details__item">
                  <label class="confirm__label" for="delivery">Delivery address:</label>
                  <input class="personal-details__input" type="email" id="delivery">
                  <div class="confirm__check">Error</div>
                </li>
              </ul>
            </fieldset>
            <fieldset class="confirm__item credit-details">
              <legend class="confirm__title">Credit card details</legend>
              <ul class="confirm__details">
                <li class="credit-details__item">
                  <label class="confirm__label" for="card">Card number:</label>
                  <input class="credit-details__input" type="number" id="card" pattern="[0-9]{13,16}">
                  <div class="credit-details__payment"></div>
                  <div class="confirm__check">Error</div>
                </li>
                <ul class="card-valid">
                  <li class="credit-details__item">
                    <label class="confirm__label" for="data">Valid Thru:</label>
                    <input class="card-valid__input" id="data">
                    <div class="confirm__check">Error</div>
                  </li>
                  <li class="credit-details__item">
                    <label class="confirm__label" for="cvv">CVV:</label>
                    <input class="card-valid__input" type="number" id="cvv">
                    <div class="confirm__check">Error</div>
                  </li>
                </ul>
              </ul>
            </fieldset>
          </form>
          <button class="confirm__btn">Confirm</button>
        </div>
      </section>`;
        listener();
    })

    test('button', () => {
        const btn = document.querySelector('.confirm__btn') as HTMLElement;
        expect(btn).not.toBeNull();

        const ul = document.querySelector('.confirm__details');
        expect(ul).not.toBeNull();

        btn.click();
        expect(document.querySelector('.confirm__details')).toBeNull();
    })

    test('reject submit when form has error', () => {
        const btn = document.querySelector('.confirm__btn') as HTMLElement;
        expect(btn).not.toBeNull();

        const name = document.getElementById('name') as HTMLInputElement;
        expect(name).not.toBeNull();

        name.classList.add('confirm__check_error');
        btn.click();
        expect(document.querySelector('.confirm__details')).not.toBeNull();
    })
})