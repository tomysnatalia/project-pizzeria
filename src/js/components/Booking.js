import {templates, select} from '../settings.js';
import { AmountWidget } from './AmountWidget.js';
import {DatePicker} from './DatePicker.js';

export class Booking {
  constructor(booking) {
    const thisBooking = this;

    thisBooking.booking = booking;

    thisBooking.render(booking);
    thisBooking.initWidgets();
  }

  render(booking) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = booking;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = booking.querySelector(select.booking.peopleAmount);

    thisBooking.dom.hoursAmount = booking.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker =  booking.querySelector(select.widgets.datePicker.wrapper);
  }

  initWidgets() {
    const thisBooking =  this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
  }
}
