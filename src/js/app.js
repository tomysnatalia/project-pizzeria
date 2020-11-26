
import {Product} from './components/Product.js';
import {Cart} from './components/Cart.js';
import {Booking} from './components/Booking.js';

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
        // console.log('parsedResponse', parsedResponse);

        /* sava parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu methd */
        thisApp.initMenu();

        // console.log('thisApp.data', JSON.stringify(thisApp.data));
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

  initPages: function () {
    const thisApp = this;

    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    // console.log(thisApp.pages);

    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));
    // thisApp.activatePage(thisApp.pages[0].id);
    let pagesMatchingHash = [];
    if (window.location.hash.length > 2) {
      const idFromHash = window.location.hash.replace('#/', '');

      pagesMatchingHash = thisApp.pages.filter(function(page) {
        return page.id == idFromHash;
      });
    }

    thisApp.activatePage(pagesMatchingHash.length ? pagesMatchingHash[0].id : thisApp.pages[0].id);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function(event) {
        const clickedElement = this;
        event.preventDefault();

        /* TODO:  get page id from href */
        const href = clickedElement.getAttribute('href');
        console.log(href);

        const cliked = href.replace('#', '');
        console.log(cliked);

        thisApp.activatePage(cliked);

        /* TOOD: active page */

      });
    }
  },

  activatePage(pageId) {
    const thisApp = this;

    for (let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }

    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.getAttribute('id') == pageId);
    }

    window.location.hash = '#/' + pageId;

  },

  initBooking: function () {
    const thisApp = this;

    thisApp.booking = document.querySelector(select.containerOf.booking);
    // console.log(thisApp.booking);

    const booking =  new Booking(thisApp.booking);

    console.log(booking);
  },

  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData();
    // thisApp.initMenu();
    thisApp.initCart();
    thisApp.initBooking();
  },

};
app.init();




