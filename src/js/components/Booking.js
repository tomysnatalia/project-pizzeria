import {templates, select} from '../settings.js';
import { AmountWidget } from './AmountWidget.js';

export class Booking {
  constructor(booking) {
    const thisBooking = this;

    thisBooking.booking = booking;

    thisBooking.render(booking);
    console.log(thisBooking.booking);
    thisBooking.initWidgets();

  }

  render(booking) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    console.log(generatedHTML);

    thisBooking.dom = {};

    thisBooking.dom.wrapper = booking;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = booking.querySelector(select.booking.peopleAmount);

    thisBooking.dom.hoursAmount = booking.querySelector(select.booking.hoursAmount);
  }

  initWidgets() {
    const thisBooking =  this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);


  }
}
