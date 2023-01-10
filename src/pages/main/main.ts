import Page from '../../models/templates/page';
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { PageIds } from '../../models/app/app';
import { Filters, FiltersId, FiltersTitle } from '../../models/enums/filters';
import { Product } from '../../models/interfaces/productsList';
import { ObjInCart } from '../cart/cart';
import { LocalStorageKey } from '../../models/enums/products';

class MainPage extends Page {
  static TextObject = {
    Default: 'All Categories',
    PriceUp: 'Price Range Up',
    PriceDown: 'Price Range Down',
    DiscountUp: 'Discount Range Up',
    DiscountDown: 'Discount Range Down',
    RatingUp: 'Rating Range Up',
    RatingDown: 'Rating Range Down',
  };

  constructor(id: string) {
    super(id);
  }

  createCategoriesBlock(parentClass: string, childClass: string, totalMod: string, checkboxMod: string, data: string[]) {
    const ul = this.createPageBlock('ul', parentClass);

    data.forEach((item) => {
      const elem = this.createPageBlock('li', childClass);
      const label = this.createPageBlock('label', 'filters__label');
      label.dataset.active = 'true';
      const labelText = this.createPageBlock('span', 'filters__label-text');
      labelText.textContent = item;

      const checkbox = this.createPageBlock('input', 'filters__checkbox', checkboxMod) as HTMLInputElement;
      checkbox.setAttribute('type', 'checkbox');
      checkbox.value = item;

      const brandTotal = this.createPageBlock('span', 'filters__total', totalMod);
      brandTotal.textContent = '0 / 1';

      label.append(...[checkbox, labelText]);
      elem.append(...[label, brandTotal]);
      ul.append(elem);
    });

    return ul;
  }

  createTitle(content: string) {
    const title = this.createPageBlock('h2', 'filters__title', 'title');
    title.textContent = content;
    return title;
  }

  createMultiRangeSlider(filters: HTMLElement, containerMod: string, titleNode: string, min: string, max: string, minId: string, maxId: string, sliderMod: string) {
    const filterContainer = this.createPageBlock('div', 'filters__container', containerMod);
    const title = this.createTitle(titleNode);
    const slider = this.createPageBlock('div', 'filters__slider', 'slider');
    const sliderBody = this.createPageBlock('div', 'slider__body', sliderMod) as noUiSlider.target;
    const inputs = this.createPageBlock('div', 'slider__inputs');
    const label1 = this.createPageBlock('label', 'slider__label');
    const span1 = this.createPageBlock('span', 'slider__text');
    span1.textContent = 'min: ';
    const input1 = this.createPageBlock('input', 'slider__input') as HTMLInputElement;
    input1.setAttribute('type', 'number');
    input1.setAttribute('min', min);
    input1.setAttribute('max', max);
    input1.setAttribute('value', min);
    input1.setAttribute('placeholder', min);
    input1.setAttribute('id', minId);
    const label2 = this.createPageBlock('label', 'slider__label');
    const span2 = this.createPageBlock('span', 'slider__text');
    const input2 = this.createPageBlock('input', 'slider__input') as HTMLInputElement;
    input2.setAttribute('type', 'number');
    input2.setAttribute('min', min);
    input2.setAttribute('max', max);
    input2.setAttribute('value', max);
    input2.setAttribute('placeholder', max);
    input2.setAttribute('id', maxId);
    span2.textContent = 'max: ';

    noUiSlider.create(sliderBody, {
      start: [min, max],
      connect: true,
      step: 1,
      range: {
        'min': [Number(min)],
        'max': [Number(max)]
      }
    });

    if (sliderBody.noUiSlider) {
      sliderBody.noUiSlider.on('update', (values, handle: number) => {
        if (handle === 0) {
          input1.value = (Math.round(Number(values[handle]))).toString();
        }
        if (handle === 1) {
          input2.value = (Math.round(Number(values[handle]))).toString();
        }
      });
    }

    [input1, input2].forEach((input, handle) => {
      input.addEventListener('change', (e) => {
        let target = <HTMLInputElement>e.currentTarget;
        let targetValue = target.value;
        if (target) {
          if (sliderBody.noUiSlider) {
            sliderBody.noUiSlider.setHandle(handle, targetValue);
          }
        }
      });
    })

    label1.append(...[span1, input1]);
    label2.append(...[span2, input2]);
    inputs.append(...[label1, label2]);
    slider.append(...[sliderBody, inputs]);
    filterContainer.append(...[title, slider]);
    filters.append(...[filterContainer]);
  }

  async getFiltersContent(filters: HTMLElement) {
    const data = await this.getPageData();
    const CategoriesData = await this.getProductsCategories();
    const dataProducts = data.products;

    //noUiSliders=====
    const prices: number[] = [];
    const stock: number[] = [];

    dataProducts.forEach((item) => {
      const itemPrice = item.price;
      const itemStock = item.stock;
      prices.push(itemPrice);
      stock.push(itemStock);
    });

    prices.sort((a, b) => a - b);
    stock.sort((a, b) => a - b);

    const minPrice = prices[0].toString();
    const maxPrice = prices[prices.length - 1].toString();
    const minStock = stock[0].toString();
    const maxStock = stock[prices.length - 1].toString();

    this.createMultiRangeSlider(filters, 'filters__container-price', 'Price', minPrice, maxPrice, 'min-price', 'max-price', 'slider__body-price');
    this.createMultiRangeSlider(filters, 'filters__container-stock', 'Stock', minStock, maxStock, 'min-stock', 'max-stock', 'slider__body-stock');

    const sliderPrice = document.querySelector('.filters__container-price') as HTMLElement;
    const sliderStock = document.querySelector('.filters__container-stock') as HTMLElement;
    const sliderBodyPrice = document.querySelector('.slider__body-price') as noUiSlider.target;
    const sliderBodyStock = document.querySelector('.slider__body-stock') as noUiSlider.target;
    const cards = document.querySelectorAll('.products__card') as NodeListOf<HTMLElement>;
    const cardsTitle = document.querySelector('.cards__title ') as HTMLElement;

    const found = document.querySelector('.cards__found-info') as HTMLElement;

    function showCards(matchArray: Array<Product["id"]>) {
      if (matchArray.length === 0) {
        cards.forEach(item => {
          item.classList.add('hidden');
        });

        cardsTitle.textContent = FiltersTitle.NotFound;
      } else {
        cardsTitle.textContent = FiltersTitle.Sorted;
        return cards.forEach(item => {
          item.classList.remove('hidden');
          let id = Number(item.dataset.id);
          if (!matchArray.includes(id)) {
            item.classList.add('hidden');
          }
        });
      }
    }

    function setFoundInfo(matchArray: Array<Product["id"]>) {
      if (matchArray.length === 0) {
        found.textContent = '0';
      }

      if (found) {
        const text = `${dataProducts.length}`;
        if (matchArray.length === 0) {
          found.textContent = text;
        }
        found.textContent = `${matchArray.length}`;
      }
    }

    function getSliderDataPrice() {
      if (sliderBodyPrice.noUiSlider) {
        const sliderValue = sliderBodyPrice.noUiSlider.get();
        const minVal = +sliderValue[0 as unknown as keyof typeof sliderValue];
        const maxVal = +sliderValue[1 as unknown as keyof typeof sliderValue];

        const idArrPrice: Array<Product["id"]> = [];
        const arrStockValues: Array<Product["stock"]> = [];

        if (sliderBodyPrice) {
          dataProducts.forEach((item) => {
            const itemPrice = item.price;
            if (itemPrice >= minVal && itemPrice <= maxVal) {
              idArrPrice.push(item.id);
              arrStockValues.push(item.stock);
            }
          });
        }

        arrStockValues.sort((a, b) => a - b);
        // console.log('price: ', idArrPrice);
        // console.log('stock values sort: ', arrStockValues);
        // if (sliderBodyStock.noUiSlider) {
        //   sliderBodyStock.noUiSlider.set([arrStockValues[0], arrStockValues[arrStockValues.length - 1]]);
        // }

        return idArrPrice;
      }
    }

    function getSliderDataStock() {
      if (sliderBodyStock.noUiSlider) {
        const sliderValue = sliderBodyStock.noUiSlider.get();
        const minVal = +sliderValue[0 as unknown as keyof typeof sliderValue];
        const maxVal = +sliderValue[1 as unknown as keyof typeof sliderValue];

        const idArrStock: Array<Product["id"]> = [];
        const arrPriceValues: Array<Product["price"]> = [];

        if (sliderBodyStock) {
          dataProducts.forEach((item) => {
            const itemStock = item.stock;
            if (itemStock >= minVal && itemStock <= maxVal) {
              idArrStock.push(item.id);
              arrPriceValues.push(item.price);
            }
          });
        }
        // console.log('stock: ', idArrStock);
        // console.log('price values: ', arrPriceValues);

        return idArrStock;
      }
    }

    function getSliderDataIds() {
      const productsAmount = dataProducts.length;
      const arrPrice = getSliderDataPrice();
      const arrStock = getSliderDataStock();

      let allIds: Array<Product["id"]> = [];

      if (arrPrice && arrStock) {
        if (arrPrice.length === productsAmount
          && arrStock.length === productsAmount) {

          allIds.push(...arrPrice);

        } else if (arrPrice.length !== productsAmount
          && arrStock.length !== productsAmount) {

          arrStock.forEach(item => {
            if (arrPrice.includes(item)) {
              allIds.push(item);
            };
          })

        } else if (arrPrice.length !== productsAmount) {
          allIds.push(...arrPrice);
        } else if (arrStock.length !== productsAmount) {
          allIds.push(...arrStock);
        }
      };

      return allIds;
    }

    function setCards() {
      const allSliderIds = getSliderDataIds();
      let allIds: Array<Product["id"]> = [...allSliderIds];

      showCards(allIds);
      setFoundInfo(allIds);
      setCategoriesToShow();
      setBrandsToShow();
    }

    sliderPrice.addEventListener('change', setCards);
    sliderStock.addEventListener('change', setCards);
    sliderPrice.addEventListener('click', setCards);
    sliderStock.addEventListener('click', setCards);

    //categories=============================================================

    const filterContainerCategories = this.createPageBlock('div', 'filters__container');
    const CategoriesTitle = this.createTitle('Category');
    const categories = this.createCategoriesBlock('filters__categories', 'filters__category', 'filters__total-category', 'filters__checkbox-category', CategoriesData);
    filterContainerCategories.append(...[CategoriesTitle, categories]);
    filters.append(...[filterContainerCategories]);

    const arrCategoryProducts: string[] = [];

    dataProducts.forEach((item) => {
      const allCategories = item.category.toLowerCase();
      arrCategoryProducts.push(allCategories);
    })

    const objCategoryProducts = CategoriesData.map((name) => {
      return { count: 0, name: name }
    });

    for (let i = 0; i < arrCategoryProducts.length; i += 1) {
      for (let j = 0; j < objCategoryProducts.length; j += 1) {
        if (arrCategoryProducts[i] === objCategoryProducts[j].name) {
          objCategoryProducts[j].count += 1;
        }
      }
    }

    const totalCategories = document.querySelectorAll('.filters__total-category');

    function fillTotalCategories() {
      for (let i = 0; i < objCategoryProducts.length; i += 1) {
        totalCategories[i].textContent = `${objCategoryProducts[i].count} / ${objCategoryProducts[i].count}`;
      }
    }

    fillTotalCategories();

    const allCategories = document.querySelector('.filters__categories') as HTMLElement;
    const checkboxCategoryList = document.querySelectorAll('.filters__checkbox-category') as NodeListOf<HTMLInputElement>;

    function styleCheckboxes(checkboxList: NodeListOf<HTMLInputElement>, arrCheckboxes: Array<Product["category"]> | Array<Product["brand"]>) {
      checkboxList.forEach((item) => {
        const inputLabel = item.parentElement;
        const total = inputLabel?.nextElementSibling as HTMLElement;

        if (inputLabel) {
          if (!arrCheckboxes.includes(item.value)) {
            inputLabel.style.opacity = '0.5';
            inputLabel.dataset.active = 'false';
            if (total) {
              total.style.opacity = '0.5';
            }

          } else {
            inputLabel.style.opacity = '1';
            inputLabel.dataset.active = 'true';

            if (total) {
              total.style.opacity = '1';
            }
          }
        }
      });
    }

    function getCategoriesData() {
      const allCheckedCategories: Array<Product["category"]> = [];
      const checkedCategoriesId: Array<Product["id"]> = [];

      checkboxCategoryList.forEach((item) => {
        const inputLabel = item.parentElement;
        if (inputLabel) {
          if (inputLabel.dataset.active === 'true' && item.checked) {
            allCheckedCategories.push(item.value);
          }
        }
      });

      dataProducts.filter((item) => {
        const itemCategory = item.category.toLocaleLowerCase();
        if (allCheckedCategories.includes(itemCategory)) {
          checkedCategoriesId.push(item.id);
        }
      });

      return checkedCategoriesId;
    }

    function setCategoriesToShow() {
      const allSliderIds = getSliderDataIds();
      const categories: Array<Product["category"]> = [];

      dataProducts.forEach((item) => {
        if (allSliderIds.includes(item.id)) {
          categories.push(item.category);
        }
      })

      const categoriesObj = CategoriesData.map((name) => {
        return { count: 0, name: name }
      });

      for (let i = 0; i < categories.length; i += 1) {
        for (let j = 0; j < categoriesObj.length; j += 1) {
          if (categories[i] === categoriesObj[j].name) {
            categoriesObj[j].count += 1;
          }
        }
      }

      styleCheckboxes(checkboxCategoryList, categories);

      for (let i = 0; i < objCategoryProducts.length; i += 1) {
        totalCategories[i].textContent = `${categoriesObj[i].count} / ${objCategoryProducts[i].count}`;
      }

    }

    function setCardsForCheckboxes() {
      const sliderDataIds = getSliderDataIds();

      const checkedBrandsId: Array<Product["id"]> = getBrandsData();
      const checkedCategoriesId: Array<Product["id"]> = getCategoriesData();
      const checkedIds: Array<Product["id"]> = [];

      const [long, short] = checkedBrandsId.length > checkedCategoriesId.length ? [checkedBrandsId, checkedCategoriesId] : [checkedCategoriesId, checkedBrandsId];
      short.sort((a, b) => a - b);
      const shortLength = short.length;

      const binSearch = (needle: Product["id"]) => {
        let start = 0, finish = shortLength - 1;
        while (start <= finish) {
          const center = Math.floor((start + finish) / 2);
          if (short[center] < needle) start = center + 1;
          else if (short[center] > needle) finish = center - 1;
          else return true;
        }
        return false;
      }

      for (let i = 0; i < long.length; i += 1)
        if (binSearch(long[i])) checkedIds.push(long[i]);

      if (checkedBrandsId.length === 0 && checkedCategoriesId.length === 0) {
        showCards(sliderDataIds);
        setFoundInfo(sliderDataIds);
      } else if (checkedBrandsId.length === 0) {
        showCards(checkedCategoriesId);
        setFoundInfo(checkedCategoriesId);
      } else if (checkedCategoriesId.length === 0) {
        showCards(checkedBrandsId);
        setFoundInfo(checkedBrandsId);
      } else if (checkedIds) {
        showCards(checkedIds);
        setFoundInfo(checkedIds);
      }
    }

    allCategories.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const sliderDataIds = getSliderDataIds();

      if (target) {

        if (target.closest('.filters__label')) {
          const label = target.closest('.filters__label') as HTMLElement;
          const checkbox = target.closest('.filters__checkbox-category') as HTMLInputElement;

          if (label) {

            if (label.dataset.active === 'false') {

              if (checkbox.checked) {
                cardsTitle.textContent = FiltersTitle.NotFound;
                cards.forEach((item) => {
                  item.classList.add('hidden');
                })
              } else {
                setCards();
              }

            } else if (label.dataset.active === 'true') {

              if (sliderDataIds.length === dataProducts.length) {
                setCardsForCheckboxes();
              } else {
                showCheckedCheckboxesWithSliders();
              }
            }
          }
        }
      }
    });

    //brands=========

    const filterContainerBrand = this.createPageBlock('div', 'filters__container');
    const brandTitle = this.createTitle('Brand');
    const arrDataProducts: string[] = [];

    dataProducts.forEach((item) => {
      const allBrands = item.brand.toLowerCase();
      arrDataProducts.push(allBrands);
    })

    const uniqArrDataProducts = [...new Set(arrDataProducts)];
    const brand = this.createCategoriesBlock('filters__brands', 'filters__brand', 'filters__total-brand', 'filters__checkbox-brand', uniqArrDataProducts);


    const objDataProducts = uniqArrDataProducts.map((name) => {
      return { count: 0, name: name }
    });

    for (let i = 0; i < arrDataProducts.length; i += 1) {
      for (let j = 0; j < objDataProducts.length; j += 1) {
        if (arrDataProducts[i] === objDataProducts[j].name) {
          objDataProducts[j].count += 1;
        }
      }
    }

    filterContainerBrand.append(...[brandTitle, brand]);
    filters.append(...[filterContainerBrand]);

    const totalBrands = document.querySelectorAll('.filters__total-brand');

    function fillTotalBrand() {
      for (let i = 0; i < objDataProducts.length; i += 1) {
        totalBrands[i].textContent = `${objDataProducts[i].count} / ${objDataProducts[i].count}`;
      }
    }
    fillTotalBrand();

    const allBrands = document.querySelector('.filters__brands') as HTMLElement;
    const checkboxBrandsList = document.querySelectorAll('.filters__checkbox-brand') as NodeListOf<HTMLInputElement>;

    function getBrandsData() {
      const allCheckedBrands: Array<Product["brand"]> = [];
      const checkedBrandsId: Array<Product["id"]> = [];

      checkboxBrandsList.forEach((item) => {
        const inputLabel = item.parentElement;
        if (inputLabel) {
          if (inputLabel.dataset.active === 'true' && item.checked) {
            allCheckedBrands.push(item.value);
          }
        }
      });

      dataProducts.filter((item) => {
        const itemCategory = item.brand.toLocaleLowerCase();
        if (allCheckedBrands.includes(itemCategory)) {
          checkedBrandsId.push(item.id);
        }
      });
      console.log(checkedBrandsId);

      return checkedBrandsId;
    }

    function setBrandsToShow() {
      const allSliderIds = getSliderDataIds();
      const brands: Array<Product["brand"]> = [];

      dataProducts.forEach((item) => {
        if (allSliderIds.includes(item.id)) {
          const brandToPush = (item.brand).toLocaleLowerCase();
          brands.push(brandToPush);
        }
      })

      const brandsObj = uniqArrDataProducts.map((name) => {
        return { count: 0, name: name }
      });

      for (let i = 0; i < brands.length; i += 1) {
        for (let j = 0; j < brandsObj.length; j += 1) {
          if (brands[i] === brandsObj[j].name) {
            brandsObj[j].count += 1;
          }
        }
      }

      styleCheckboxes(checkboxBrandsList, brands);

      for (let i = 0; i < objDataProducts.length; i += 1) {
        totalBrands[i].textContent = `${brandsObj[i].count} / ${objDataProducts[i].count}`;
      }

    }

    allBrands.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const sliderDataIds = getSliderDataIds();

      if (target) {

        if (target.closest('.filters__label')) {
          const label = target.closest('.filters__label') as HTMLElement;
          const checkbox = target.closest('.filters__checkbox-brand') as HTMLInputElement;

          if (label) {

            if (label.dataset.active === 'false') {

              if (checkbox.checked) {
                cardsTitle.textContent = FiltersTitle.NotFound;
                cards.forEach((item) => {
                  item.classList.add('hidden');
                })
              } else {
                setCards();
              }

            } else if (label.dataset.active === 'true') {

              if (sliderDataIds.length === dataProducts.length) {
                console.log(getBrandsData());
                setCardsForCheckboxes();
              } else {
                // showCheckedBrandsWithSliders();
                showCheckedCheckboxesWithSliders();
              }
            }
          }
        }
      }

    })

    function showCheckedCheckboxesWithSliders() {
      const activeCardsId = getSliderDataIds();
      // const activeBrandCheckboxes: string[] = setActiveCheckboxes(checkboxBrandsList);
      // const activeCategoryCheckboxes: string[] = setActiveCheckboxes(checkboxCategoryList);
      const checkedBrandCheckboxes: string[] = setCheckedCheckboxes(checkboxBrandsList);
      const checkedCategoryCheckboxes: string[] = setCheckedCheckboxes(checkboxCategoryList);

      //for localStorage
      function setActiveCheckboxes(list: NodeListOf<HTMLInputElement>) {
        const result: string[] = [];

        list.forEach((item) => { //найти active чекбоксы
          const label = item.parentElement;
          if (label) {
            if (label.dataset.active === 'true') {
              result.push(item.value)
            }
          }
        })

        return result;
      }

      function setCheckedCheckboxes(list: NodeListOf<HTMLInputElement>) {
        const result: string[] = [];

        list.forEach((item) => { //найти active чекбоксы
          const label = item.parentElement;
          if (item.checked) {
            if (label) {
              if (label.dataset.active === 'true') {
                result.push(item.value);
              }
            }
          }
        })

        return result;
      }

      cards.forEach((item) => { //найти активные карточки

        const id = Number(item.dataset.id);
        const brand = item.dataset.brand;
        const category = item.dataset.category;

        if (activeCardsId.includes(id)) {
          item.classList.remove('hidden');
        }

        checkedBrandCheckboxes.forEach((elem) => {
          if (elem !== brand) {
            item.classList.add('hidden');
          }
        })

        checkedCategoryCheckboxes.forEach((elem) => {
          if (elem !== category) {
            item.classList.add('hidden');
          }
        })

        if (brand && category) {
          if (activeCardsId.includes(id)
            && (checkedBrandCheckboxes.includes(brand) || checkedCategoryCheckboxes.includes(category))) {
            item.classList.remove('hidden');
            console.log(item); //add items id to local storage
          }
        }

      })
    }

    function resetFilters() {
      const resetButton = document.querySelector('.filters__button-reset');
      const labelsList = document.querySelectorAll('.filters__label') as NodeListOf<HTMLElement>;
      const sort = document.querySelector('.sort');

      function resetCategoriesStyles() {
        labelsList.forEach((item) => {
          item.dataset.active = 'true';
          item.style.opacity = '1';
          const total = item.nextElementSibling as HTMLElement;
          total.style.opacity = '1';
        })
      }

      if (resetButton) {
        resetButton.addEventListener('click', () => {
          if (sort) {
            found.textContent = '100';
          }

          fillTotalCategories();
          fillTotalBrand();
          for (let i = 0; i < objDataProducts.length; i += 1) {
            totalBrands[i].textContent = `${objDataProducts[i].count} / ${objDataProducts[i].count}`;
          }
          resetCategoriesStyles();
        })
      }
    }

    resetFilters();
  }

  async createFiltersButtons(buttons: HTMLElement) {
    const data = await this.getPageData();
    let products = data.products;

    const reset = this.createPageBlock('button', 'filters__button', 'filters__button-reset');
    reset.textContent = 'Reset Filters';
    const copy = this.createPageBlock('button', 'filters__button', 'filters__button-copy');
    copy.textContent = 'Copy Link';
    buttons.append(...[reset, copy]);

    reset.addEventListener('click', () => {
      const cards = document.querySelector('.cards') as HTMLElement;
      cards.dataset.filter = Filters.Default;

      const cardsTitle = document.querySelector('.cards__title') as HTMLElement;
      cardsTitle.textContent = MainPage.TextObject.Default;

      const selectTag = document.querySelector('.select__tag') as HTMLSelectElement;
      selectTag.selectedIndex = 0;

      const cardsProducts = document.querySelector('.cards__products') as HTMLElement;
      cardsProducts.innerHTML = '';
      this.filterCards(products, cardsProducts);

      const showButton = document.querySelector('.cards__show-button') as HTMLButtonElement;
      showButton.textContent = 'Show More';
      cardsProducts.style.gridTemplateColumns = 'repeat(3, auto)';

      const sliderPrice = document.querySelector('.slider__body-price') as noUiSlider.target;
      const sliderStock = document.querySelector('.slider__body-stock') as noUiSlider.target;

      if (sliderPrice.noUiSlider && sliderStock.noUiSlider) {
        sliderPrice.noUiSlider.reset();
        sliderStock.noUiSlider.reset();
      }

      function resetCategoryFilters() {
        const checkboxCategoryList = document.querySelectorAll('.filters__checkbox-category') as NodeListOf<HTMLInputElement>;
        checkboxCategoryList.forEach((item) => {
          item.checked = false;
        })
      }

      resetCategoryFilters();

      localStorage.removeItem('filter');
      localStorage.removeItem('cards-view');

      const location = window.location.href;
      const arrIdPage = location.split('#');
      const lastItem = arrIdPage[arrIdPage.length - 1];

      if (lastItem !== 'main-page' && location.includes('#')) {
        window.location.href = location.replace(lastItem, 'main-page');
      }
    })

    copy.addEventListener('click', () => {
      const link = window.location.href;
      navigator.clipboard.writeText(link);

      let text = copy.textContent;
      copy.textContent = 'Copied!';
      setTimeout(() => copy.textContent = text, 2000);
    })

    return buttons;
  }

  createFilters() {
    const filters = this.createPageBlock('aside', 'filters');

    const buttons = this.createPageBlock('div', 'filters__buttons');
    this.createFiltersButtons(buttons);
    filters.append(...[buttons]);

    this.getFiltersContent(filters)

    return filters;
  }

  createCardsSelect(sort: HTMLElement) {
    const select = this.createPageBlock('div', 'sort__select', 'select');
    const selectText = this.createPageBlock('span', 'select__text');
    selectText.textContent = 'Sort by:';
    const selectWrap = this.createPageBlock('div', 'select__wrap');
    const selectTag = this.createPageBlock('select', 'select__tag') as HTMLSelectElement;
    const option = this.createPageBlock('option', 'select__option');
    option.setAttribute('value', Filters.Default);
    option.textContent = MainPage.TextObject.Default;
    const option1 = this.createPageBlock('option', 'select__option');
    option1.setAttribute('value', Filters.PriceUp);
    option1.textContent = MainPage.TextObject.PriceUp;
    const option2 = this.createPageBlock('option', 'select__option');
    option2.setAttribute('value', Filters.PriceDown);
    option2.textContent = MainPage.TextObject.PriceDown;
    const option3 = this.createPageBlock('option', 'select__option');
    option3.setAttribute('value', Filters.DiscountUp);
    option3.textContent = MainPage.TextObject.DiscountUp;
    const option4 = this.createPageBlock('option', 'select__option');
    option4.setAttribute('value', Filters.DiscountDown);
    option4.textContent = MainPage.TextObject.DiscountDown;
    const option5 = this.createPageBlock('option', 'select__option');
    option5.setAttribute('value', Filters.RatingUp);
    option5.textContent = MainPage.TextObject.RatingUp;
    const option6 = this.createPageBlock('option', 'select__option');
    option6.setAttribute('value', Filters.RatingDown);
    option6.textContent = MainPage.TextObject.RatingDown;
    selectTag.append(...[option, option1, option2, option3, option4, option5, option6]);
    selectWrap.append(...[selectTag]);
    select.append(...[selectText, selectWrap]);
    sort.append(...[select]);

    const cardsFilter = localStorage.getItem('filter');
    if (cardsFilter) {
      const cardsFilterParse = JSON.parse(cardsFilter);
      selectTag.selectedIndex = Number(cardsFilterParse[0]);
    } else {
      selectTag.selectedIndex = 0;
    }
  }

  createFound(sort: HTMLElement) {
    const found = this.createPageBlock('div', 'cards__found');
    const foundText = this.createPageBlock('span', 'cards__found-text');
    foundText.textContent = 'Found:';
    const foundInfo = this.createPageBlock('span', 'cards__found-info');
    foundInfo.textContent = '100';
    found.append(...[foundText, foundInfo]);
    sort.append(...[found]);
  }

  createSearch(sort: HTMLElement) {
    const search = this.createPageBlock('div', 'cards__search');
    const searchInput = this.createPageBlock('input', 'cards__search-input');
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('placeholder', 'Search product');
    search.append(...[searchInput]);
    sort.append(...[search]);
  }

  createShowMore(sort: HTMLElement) {
    const show = this.createPageBlock('div', 'cards__show');
    const showButton = this.createPageBlock('button', 'cards__show-button') as HTMLButtonElement;
    showButton.textContent = 'Show More';

    show.append(...[showButton]);
    sort.append(...[show]);

    function setShowCardsView(cards: HTMLElement) {
      if (showButton.classList.contains('active')) {
        showButton.textContent = 'Show Less';
        cards.style.gridTemplateColumns = 'repeat(5, auto)';
        localStorage.setItem('cards-view', JSON.stringify('showMore'));
        //add query-params (use URLSearchParams)
      } else {
        showButton.textContent = 'Show More';
        cards.style.gridTemplateColumns = 'repeat(3, auto)'
        localStorage.setItem('cards-view', JSON.stringify('showLess'));

      }
    }

    showButton.addEventListener('click', () => {
      showButton.classList.toggle('active');
      const cardsProducts = document.querySelector('.cards__products') as HTMLElement;
      setShowCardsView(cardsProducts);
    })
  }

  createCardsSort(cards: HTMLElement) {
    const sort = this.createPageBlock('div', 'cards__sort', 'sort');

    this.createCardsSelect(sort);
    this.createFound(sort);
    this.createSearch(sort);
    this.createShowMore(sort);
    cards.append(...[sort]);
  }

  filterCards(product: Array<Product>, cardsProducts: HTMLElement) {
    return product.forEach((item) => {
      const card = this.createPageBlock('div', 'cards__card', 'products__card');
      card.dataset.id = `${item.id}`;
      let brand = (item.brand).toLowerCase();
      let category = (item.category).toLowerCase();
      card.dataset.brand = brand;
      card.dataset.category = category;
      const cardTitle = this.createPageBlock('h3', 'products__title');
      cardTitle.textContent = item.title;
      const cardItems = this.createPageBlock('div', 'products__items');
      const cardImage = this.createPageBlock('div', 'products__image');
      cardImage.style.background = `url('${item.images[0]}') 0 0/cover no-repeat`;
      const cardText = this.createPageBlock('div', 'products__text');
      const cardInfo = this.createPageBlock('div', 'products__info');
      const cardStock = this.createPageBlock('div', 'products__stock');
      cardStock.textContent = `Stock: ${item.stock}`;
      const cardPrice = this.createPageBlock('div', 'products__price');
      cardPrice.textContent = `Price: $ ${item.price}`;
      const cardDiscount = this.createPageBlock('div', 'products__discount');
      cardDiscount.textContent = `Discount: ${item.discountPercentage}%`;
      const cardRating = this.createPageBlock('div', 'products__rating', 'rating');
      const cardRatingBody = this.createPageBlock('div', 'rating__body');
      const cardRatingActive = this.createPageBlock('div', 'rating__active');
      const cardRatingItems = this.createPageBlock('div', 'rating__items');

      for (let i = 0; i < 5; i += 1) {
        const item = this.createPageBlock('input', 'rating__item');
        item.setAttribute('type', 'radio');
        item.setAttribute('value', `${i + 1}`);
        item.setAttribute('name', 'rating');
        cardRatingItems.append(item);
      }

      const cardRatingValue = this.createPageBlock('div', 'rating__value');
      cardRatingValue.textContent = `${item.rating}`;

      function setRating(index: string = cardRatingValue.innerHTML) {
        const ratingActiveWidth = Number(index) / 0.05;
        cardRatingActive.style.width = `${ratingActiveWidth}%`;
      }

      setRating();

      const productsInCart = JSON.parse(localStorage.getItem(LocalStorageKey.productsInCart) || '{}');
      const cardButtons = this.createPageBlock('div', 'products__buttons');
      const cardButtonAdd = this.createPageBlock('button', 'products__button', 'products__add');
      if (item.id in productsInCart) {
        cardButtonAdd.textContent = 'remove';
      } else {
        cardButtonAdd.textContent = 'add to cart';
      }

      cardButtonAdd.onclick = () => {
        const productsInCart = JSON.parse(localStorage.getItem(LocalStorageKey.productsInCart) || '{}');
        if (item.id in productsInCart) {
          delete productsInCart[item.id];
          cardButtonAdd.textContent = 'add to cart';
        } else {
          productsInCart[item.id] = { count: 1, product: item };
          cardButtonAdd.textContent = 'remove';
        }
        const arrValue = Object.values(productsInCart) as ObjInCart[];
        const totalCost = arrValue.reduce((acc: number, item: ObjInCart) => acc + (item.count * item.product.price), 0);
        const totalQty = arrValue.reduce((acc: number, item: ObjInCart) => acc + item.count, 0);
        localStorage.setItem(LocalStorageKey.productsInCart, JSON.stringify(productsInCart));
        const cart = document.querySelector('.header__total');
        const total = document.querySelector('.header__sum-total');
        (cart as HTMLElement).textContent = String(totalQty);
        (total as HTMLElement).textContent = String(totalCost);
      }

      const cardButtonDetails = this.createPageBlock('button', 'products__button', 'products__details');
      cardButtonDetails.textContent = 'Details';
      cardButtonDetails.onclick = function () {
        window.location.hash = `${PageIds.DescriptionPage}/${item.id}`;
      }

      cardButtons.append(...[cardButtonAdd, cardButtonDetails]);
      cardRatingBody.append(...[cardRatingActive, cardRatingItems]);
      cardRating.append(...[cardRatingBody, cardRatingValue]);
      cardInfo.append(...[cardStock, cardPrice, cardDiscount, cardRating]);
      cardText.append(...[cardInfo, cardButtons]);
      cardItems.append(...[cardImage, cardText]);
      card.append(...[cardTitle, cardItems]);
      cardsProducts.append(...[card]);
    })
  }

  async createCardsProducts(cards: HTMLElement) {
    const cardsContainer = this.createPageBlock('div', 'cards__container');
    const title = this.createPageBlock('h1', 'cards__title', 'title');
    title.textContent = MainPage.TextObject.Default;
    const cardsProducts = this.createPageBlock('div', 'cards__products', 'products');

    const data = await this.getPageData();
    let products = data.products;

    const hash = window.location.hash.slice(1);
    const arrIdPage = hash.split('/');
    const lastItem = arrIdPage[arrIdPage.length - 1];
    if (lastItem) {
      sortCards(lastItem);
    }


    const cardsView = localStorage.getItem('cards-view');
    if (cardsView) {
      const showButton = document.querySelector('.cards__show-button') as HTMLButtonElement;
      if (JSON.parse(cardsView) === 'showMore') {
        cardsProducts.style.gridTemplateColumns = 'repeat(5, auto)';
        showButton.textContent = 'Show Less';
      } else {
        cardsProducts.style.gridTemplateColumns = 'repeat(3, auto)';
        showButton.textContent = 'Show More';
      }
    }

    const cardsFilter = localStorage.getItem('filter');

    if (cardsFilter) {
      const cardsFilterParse = JSON.parse(cardsFilter);
      cards.dataset.filter = cardsFilterParse[1];
      sortCards(cardsFilterParse[1]);
    }
    this.filterCards(products, cardsProducts);
    // console.log(data);
    // console.log(products);

    function sortByPriceUp(arr: Array<Product>) {
      return arr.sort((a, b) => a.price > b.price ? 1 : -1);
    }

    function sortByPriceDown(arr: Array<Product>) {
      return arr.sort((a, b) => a.price < b.price ? 1 : -1);
    }

    function sortByDiscountUp(arr: Array<Product>) {
      return arr.sort((a, b) => a.discountPercentage > b.discountPercentage ? 1 : -1);
    }

    function sortByDiscountDown(arr: Array<Product>) {
      return arr.sort((a, b) => a.discountPercentage < b.discountPercentage ? 1 : -1);
    }

    function sortByRatingUp(arr: Array<Product>) {
      return arr.sort((a, b) => a.rating > b.rating ? 1 : -1);
    }

    function sortByRatingDown(arr: Array<Product>) {
      return arr.sort((a, b) => a.rating < b.rating ? 1 : -1);
    }

    function sortDefault(arr: Array<Product>) {
      return arr.sort((a, b) => a.id > b.id ? 1 : -1);
    }

    function sortCards(value: string) {
      switch (value) {
        case Filters.Default:
          cardsProducts.innerHTML = '';
          title.textContent = MainPage.TextObject.Default;
          products = sortDefault(data.products);
          localStorage.setItem('filter', JSON.stringify([FiltersId.Default, Filters.Default]));
          break
        case Filters.PriceUp:
          cardsProducts.innerHTML = '';
          title.textContent = MainPage.TextObject.PriceUp;
          products = sortByPriceUp(data.products);
          localStorage.setItem('filter', JSON.stringify([FiltersId.PriceUp, Filters.PriceUp]));
          break
        case Filters.PriceDown:
          cardsProducts.innerHTML = '';
          title.textContent = MainPage.TextObject.PriceDown;
          products = sortByPriceDown(data.products);
          localStorage.setItem('filter', JSON.stringify([FiltersId.PriceDown, Filters.PriceDown]));
          break
        case Filters.DiscountUp:
          cardsProducts.innerHTML = '';
          title.textContent = MainPage.TextObject.DiscountUp;
          products = sortByDiscountUp(data.products);
          localStorage.setItem('filter', JSON.stringify([FiltersId.DiscountUp, Filters.DiscountUp]));
          break
        case Filters.DiscountDown:
          cardsProducts.innerHTML = '';
          title.textContent = MainPage.TextObject.DiscountDown;
          products = sortByDiscountDown(data.products);
          localStorage.setItem('filter', JSON.stringify([FiltersId.DiscountDown, Filters.DiscountDown]));
          break
        case Filters.RatingUp:
          cardsProducts.innerHTML = '';
          title.textContent = MainPage.TextObject.RatingUp;
          products = sortByRatingUp(data.products);
          localStorage.setItem('filter', JSON.stringify([FiltersId.RatingUp, Filters.RatingUp]));
          break
        case Filters.RatingDown:
          cardsProducts.innerHTML = '';
          title.textContent = MainPage.TextObject.RatingDown;
          products = sortByRatingDown(data.products);
          localStorage.setItem('filter', JSON.stringify([FiltersId.RatingDown, Filters.RatingDown]));
          break
      }
    }

    const sortSelect = document.querySelector('.select__tag') as HTMLSelectElement;

    if (sortSelect.value) {
      sortSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLOptionElement;
        const targetValue = target.value;

        const location = window.location.href;
        const hash = window.location.hash.slice(1);
        const arrIdPage = hash.split('/');
        const lastItem = arrIdPage[arrIdPage.length - 1];

        let regexp: RegExp;

        switch (lastItem) {
          case '':
            window.location.href = `${location}#main-page/${targetValue}`;
            break
          case 'main-page':
            window.location.href = `${location}/${targetValue}`
            break
          case Filters.Default:
            regexp = /default/g;
            window.location.href = location.replace(regexp, targetValue);
            break
          case Filters.PriceUp:
            regexp = /price-up/g;
            window.location.href = location.replace(regexp, targetValue);
            break
          case Filters.PriceDown:
            regexp = /price-down/g;
            window.location.href = location.replace(regexp, targetValue);
            break
          case Filters.DiscountUp:
            regexp = /discount-up/g;
            window.location.href = location.replace(regexp, targetValue);
            break
          case Filters.DiscountDown:
            regexp = /discount-down/g;
            window.location.href = location.replace(regexp, targetValue);
            break
          case Filters.RatingUp:
            regexp = /rating-up/g;
            window.location.href = location.replace(regexp, targetValue);
            break
          case Filters.RatingDown:
            regexp = /rating-down/g;
            window.location.href = location.replace(regexp, targetValue);
            break
        }

        if (target && title) {
          cards.dataset.filter = targetValue;
          sortCards(targetValue);
          this.filterCards(products, cardsProducts);
        }
      })
    }

    cardsContainer.append(...[title, cardsProducts]);
    cards.append(...[cardsContainer]);
  }

  createCads() {
    const cards = this.createPageBlock('section', 'cards');
    cards.dataset.filter = Filters.Default;
    this.createCardsSort(cards);
    this.createCardsProducts(cards);
    return cards;
  }

  render() {
    const mainWrapper = this.createPageBlock('div', 'wrapper');
    const filters = this.createFilters();
    const cards = this.createCads();

    mainWrapper.append(...[cards, filters]);
    this.main?.append(mainWrapper);

    return this.main;
  }
}

console.log('Score:270/300\nmain page with filters 90/120\n(query parameters for filters -10\nquery parameters for sort - 5\nsearch - 15)\nShopping Cart Page 60/60\nConfirm modal window 50 / 50\nProduct description page 40/40\nHeader 20/20\n404 10/10');

export default MainPage;
