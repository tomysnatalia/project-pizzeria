import {settings, select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import {CartProduct} from './CartProduct.js';

export class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    console.log(thisCart.deliveryFee);

    thisCart.getElements(element);
    thisCart.initActions();

    // console.log('new Cart: ', thisCart);
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);


    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    for (let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }

  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
      event.preventDefault();
      if (!thisCart.dom.wrapper.classList.contains('active')) {
        thisCart.dom.wrapper.classList.add(classNames.cart.wrapperActive);
        return;
      } else {
        thisCart.dom.wrapper.classList.remove(classNames.cart.wrapperActive);
      }
    });

    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function (event) {
      event.preventDefault();
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.order;
    console.log(url);

    const payload = {
      phone: '+48 571  452 369',
      address: 'test',
      totalPrice: thisCart.totalPrice,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    for (let product of thisCart.products) {
      const data = product.getData();
      payload.products.push(data);
    }


    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (rawRespnse) {
        return rawRespnse.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });

  }

  add(menuProduct) {
    const thisCart = this;

    /* generate HTML based on tamplate */
    const generatedHTML = templates.cartProduct(menuProduct);

    /* create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.element = generatedDOM;

    /* find menu container */
    const menuContainer = document.querySelector(select.cart.productList);

    /* add element to menu */
    menuContainer.appendChild(thisCart.element);

    // console.log('adding product: ', menuProduct);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    thisCart.update();
  }

  update() {
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    const products = thisCart.products;
    console.log(products);

    for (let product of products) {

      thisCart.subtotalPrice = thisCart.subtotalPrice + product.price;
      console.log(thisCart.subtotalPrice);

      thisCart.totalNumber = thisCart.totalNumber + product.amount;
      console.log(thisCart.totalNumber);

    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    console.log(thisCart.totalPrice);

    for (let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }

  remove(cartProduct) {
    const thisCart = this;

    const index = thisCart.products.indexOf(cartProduct);
    console.log(index);

    thisCart.products.splice(index, 1);
    cartProduct.dom.wrapper.remove();

    thisCart.update();
  }
}
