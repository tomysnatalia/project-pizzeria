/* eslint-disable no-prototype-builtins */
import { select, classNames, templates } from '../settings.js';
import { utils } from '../utils.js';
import { AmountWidget } from './AmountWidget.js';

export class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordin();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    // console.log('new Product:', thisProduct);
  }

  renderInMenu() {
    const thisProduct = this;

    /* generate HTML based on tamplate */
    const generatedHTML = templates.menuProduct(thisProduct.data);

    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);

    /* add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(
      select.menuProduct.clickable
    );
    thisProduct.form = thisProduct.element.querySelector(
      select.menuProduct.form
    );
    thisProduct.formInputs = thisProduct.form.querySelectorAll(
      select.all.formInputs
    );
    thisProduct.cartButton = thisProduct.element.querySelector(
      select.menuProduct.cartButton
    );
    thisProduct.priceElem = thisProduct.element.querySelector(
      select.menuProduct.priceElem
    );
    thisProduct.imageWrapper = thisProduct.element.querySelector(
      select.menuProduct.imageWrapper
    );
    thisProduct.amountWidgetelem = thisProduct.element.querySelector(
      select.menuProduct.amountWidget
    );
  }

  initAccordin() {
    const thisProduct = this;

    /* find the clickble trigger(the element that should react to clicking) */
    // const productHeader = thisProduct.element.querySelector(select.menuProduct.clickable);
    // console.log(productHeader);

    /* START: click event listener to trigger */
    thisProduct.accordionTrigger.addEventListener('click', function (event) {
      /* prevent default action for event */
      event.preventDefault();

      /* toogle active class on element of thisProduct */
      thisProduct.element.classList.add(classNames.menuProduct.wrapperActive);

      /* find all active products */
      const allActiveProducts = document.querySelectorAll('.product.active');
      // console.log(allActiveProducts);

      /* START LOOP: for each active product */
      for (let activeProduct of allActiveProducts) {
        // console.log(activeProduct);

        /* START: if the active product isn't the element of thisProduct */
        if (activeProduct != thisProduct.element) {
          /* remove class active for the active product */
          activeProduct.classList.remove('active');
        } /* END: if the active product isn't the element of this Product */
      } /* END LOOP: for each active product */
    });
    /* END: click event listener to trigger */
  }

  initOrderForm() {
    const thisProduct = this;
    // console.log('orderForm:');

    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
      // thisProduct.element.children = thisProduct.data.element.children;
    });
  }

  processOrder() {
    const thisProduct = this;
    // console.log('processOrder:');

    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);
    // console.log('formData: ', formData);

    const allParams = thisProduct.data.params;
    // console.log(allParams);

    thisProduct.params = {};

    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price;
    // console.log(price);

    /* START LOOP: for each paramId in thisProduct.data.params */
    /* save the element in thisProduct.data.params with key paramId as const param */
    for (let paramId in allParams) {
      const param = allParams[paramId];
      // console.log(param);

      /* START LOOP: for each optionId in param.options */
      /* save the element in param.options with key optionId as const option */
      for (let optionId in param.options) {
        const option = param.options[optionId];
        // console.log(option);

        const optionSelected =
          formData.hasOwnProperty(paramId) &&
          formData[paramId].indexOf(optionId) > -1;
        // console.log(optionSelected);

        /* START IF: if option is selected and option is not default */
        if (optionSelected && !option.default) {
          let optionPrice = option.price;
          // console.log(optionPrice);

          /* add price of option to variable price */
          price = price + optionPrice;

          /* END IF: if option is selected and option is not default */
        } else if (!optionSelected && option.default) {
          /* START ELSE IF: if option is not selected and option is default */
          let optionPrice = option.price;

          /* deduct price of option from price */
          price = price - optionPrice;
        }

        if (optionSelected) {
          let productImages = thisProduct.imageWrapper.querySelectorAll(
            '.' + paramId + '-' + optionId
          );
          // console.log(productImages);
          if (!thisProduct.params[paramId]) {
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;
          for (let productImage of productImages) {
            productImage.classList.add(classNames.menuProduct.imageVisible);
          }
        } else {
          let productImages = thisProduct.imageWrapper.querySelectorAll(
            '.' + paramId + '-' + optionId
          );
          for (let productImage of productImages) {
            productImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }

    /* multiplay price by amount */
    // price *= thisProduct.amountWidget.value;
    thisProduct.priceSingle = price;
    thisProduct.price =
      thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    // const finalPrice = thisProduct.priceElem.innerHTML = price;
    thisProduct.priceElem.innerHTML = thisProduct.price;
    // console.log(thisProduct.params);
  }

  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetelem);

    thisProduct.amountWidgetelem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }

  addToCart() {
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    // app.cart.add(thisProduct);
    const event = new CustomEvent('add-to-card', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }
}
