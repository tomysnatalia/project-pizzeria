/* eslint-disable no-import-assign */
import { settings, select } from '../settings.js';
import { BaseWidget } from './BaseWidget.js';

export class AmountWidget extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.amountWidget.defaultValue);
    const thisWidget = this;

    thisWidget.getElements();
    thisWidget.initActions();

    thisWidget.dom.input.value = thisWidget.correctValue;
  }

  getElements() {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(
      select.widgets.amount.input
    );
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(
      select.widgets.amount.linkDecrease
    );
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(
      select.widgets.amount.linkIncrease
    );
  }

  isValid(newValue) {
    return (
      !isNaN(newValue) &&
      newValue >= settings.amountWidget.defaultMin &&
      newValue <= settings.amountWidget.defaultMax
    );
  }

  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function () {
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function () {
      thisWidget.value = thisWidget.value - 1;
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function () {
      thisWidget.value = thisWidget.value + 1;
    });
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;

    console.log('widget value: ', thisWidget.value);
  }
}
