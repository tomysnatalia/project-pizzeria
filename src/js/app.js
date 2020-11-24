
import {Product} from './components/Product.js';
import {Cart} from './components/Cart.js';
import {select, settings, templates, classNames} from './settings.js';

const app = {
  initMenu: function () {
    const thisApp = this;
    // console.log('thisApp.data:', thisApp.data);

    // const testProduct = new Product();
    // console.log('testProduct:', testProduct);
    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.product;
    console.log(url);

    fetch(url)
      .then(function (rawRespnse) {
        return rawRespnse.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);

        /* sava parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu methd */
        thisApp.initMenu();

        console.log('thisApp.data', JSON.stringify(thisApp.data));
      });
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-card', function(event){
      app.cart.add(event.detail.product);
    });
  },

  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);

    thisApp.initData();
    // thisApp.initMenu();
    thisApp.initCart();
  },
};
app.init();




