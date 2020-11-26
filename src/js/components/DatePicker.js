import {BaseWidget} from './BaseWidget.js';
import {select, settings} from '../settings.js';
import {utils} from '../utils.js';

export class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    console.log(thisWidget);
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);


    thisWidget.initPlugin();
  }

  initPlugin() {
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);

    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      disable: [
        function(date) {
          // return true to disable
          return (date.getDay() === 1);
        }
      ],
      locale: {
        firstDayOfWeek: 1
      },
      onChange: function(dateStr) {
        const date = utils.addDays(dateStr[0], 1);
        thisWidget.value = utils.dateToStr(date);
        console.log(thisWidget.value);
      }
    });
  }

  parseValue(newValue) {
    return parseInt(newValue);
  }

  isValid() {
    return true;
  }

  renderValue() {
  }

}
