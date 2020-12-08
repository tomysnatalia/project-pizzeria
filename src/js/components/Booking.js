/* eslint-disable no-prototype-builtins */
import { classNames, templates, select, settings } from '../settings.js';
import { AmountWidget } from './AmountWidget.js';
import { DatePicker } from './DatePicker.js';
import { HourPicker } from './HourPicker.js';
import { utils } from '../utils.js';

export class Booking {
  constructor(booking) {
    const thisBooking = this;

    thisBooking.booking = booking;

    thisBooking.render(booking);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initActions();
    thisBooking.chooseTable();
  }

  initActions() {
    const thisBooking = this;
    const buttonDiv = document.querySelector(select.booking.bookingButton);
    buttonDiv.addEventListener('click', function (event) {
      event.preventDefault();
      thisBooking.addBooking();
      thisBooking.getData();
    });

    console.log(buttonDiv);
  }

  render(booking) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = booking;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = booking.querySelector(
      select.booking.peopleAmount
    );

    thisBooking.dom.hoursAmount = booking.querySelector(
      select.booking.hoursAmount
    );

    thisBooking.dom.datePicker = booking.querySelector(
      select.widgets.datePicker.wrapper
    );

    thisBooking.dom.hourPicker = booking.querySelector(
      select.widgets.hourPicker.wrapper
    );

    thisBooking.dom.tables = booking.querySelectorAll(select.booking.tables);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);

    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function (event) {
      event.preventDefault();
      thisBooking.updateDOM();
    });
  }

  getData() {
    const thisBooking = this;

    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(
      thisBooking.datePicker.minDate
    );
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(
      thisBooking.datePicker.maxDate
    );

    const endDate = {};
    endDate[settings.db.dateEndParamKey] =
      startEndDates[settings.db.dateEndParamKey];

    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent:
        settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsDailyRepeat:
        settings.db.repeatDailyParam + '&' + utils.queryParams(endDate),
      eventsWeeklyRepeat:
        settings.db.repeatWeeklyParam + '&' + utils.queryParams(endDate),
    };

    console.log(
      settings.db.repeatWeeklyParam + '&' + utils.queryParams(endDate)
    );

    const urls = {
      booking:
        settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent:
        settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsDailyRepeat:
        settings.db.url +
        '/' +
        settings.db.event +
        '?' +
        params.eventsDailyRepeat,
      eventsWeeklyRepeat:
        settings.db.url +
        '/' +
        settings.db.event +
        '?' +
        params.eventsWeeklyRepeat,
    };

    // console.log('getData urls', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsDailyRepeat),
      fetch(urls.eventsWeeklyRepeat),
    ])
      .then(function ([
        bookingsResponse,
        eventsCurrentResponse,
        eventsDailyRepeatResponse,
        eventsWeeklyRepeatResponse,
      ]) {
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsDailyRepeatResponse.json(),
          eventsWeeklyRepeatResponse.json(),
        ]);
      })
      .then(function ([
        bookings,
        eventsCurrent,
        eventsDailyRepeat,
        eventsWeeklyRepeat,
      ]) {
        thisBooking.parseData(
          bookings,
          eventsCurrent,
          eventsDailyRepeat,
          eventsWeeklyRepeat
        );
      });
  }

  parseData(bookings, eventsCurrent, eventsDailyRepeat, eventsWeeklyRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (const reservation of eventsCurrent) {
      thisBooking.makeBooked(
        reservation.date,
        reservation.hour,
        reservation.duration,
        reservation.table
      );
    }

    for (const reservation of bookings) {
      thisBooking.makeBooked(
        reservation.date,
        reservation.hour,
        reservation.duration,
        reservation.table
      );
    }

    for (const reservation of eventsDailyRepeat) {
      for (let i = 0; i < 21; i++) {
        const newDate = utils.addDays(reservation.date, i);
        const newDateStr = utils.dateToStr(newDate);
        thisBooking.makeBooked(
          newDateStr,
          reservation.hour,
          reservation.duration,
          reservation.table
        );
      }
    }

    for (const reservation of eventsWeeklyRepeat) {
      for (let i = 0; i < 3; i++) {
        const newDate = utils.addDays(reservation.date, i * 7);
        const newDateStr = utils.dateToStr(newDate);

        thisBooking.makeBooked(
          newDateStr,
          reservation.hour,
          reservation.duration,
          reservation.table
        );
      }
    }
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    const hourNumber = utils.hourToNumber(hour);
    if (!thisBooking.booked.hasOwnProperty(date)) {
      thisBooking.booked[date] = {};
    }

    for (let i = 0; i < duration; i += 0.5) {
      if (!thisBooking.booked[date].hasOwnProperty([hourNumber + i])) {
        thisBooking.booked[date][hourNumber + i] = [];
      }
      thisBooking.booked[date][hourNumber + i].push(table);
    }
    console.log(thisBooking.booked);
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    const bookedTables = thisBooking.booked[thisBooking.date][thisBooking.hour];

    for (let table of thisBooking.dom.tables) {
      const tableNumber = table.getAttribute(settings.booking.tableIdAttribute);
      if (
        thisBooking.booked.hasOwnProperty(thisBooking.date) &&
        thisBooking.booked[thisBooking.date].hasOwnProperty(thisBooking.hour) &&
        bookedTables.includes(parseInt(tableNumber))
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  chooseTable() {
    const thisBooking = this;

    const allTables = thisBooking.dom.tables;

    for (const table of allTables) {
      table.addEventListener('click', function () {
        const clickedElement = this;
        // console.log(clickedElement);
        if (!table.classList.contains('booked')) {
          for (const eachTable of allTables) {
            eachTable.classList.remove('active');
          }
          clickedElement.classList.add('active');

          const resultElement = clickedElement.getAttribute(
            settings.booking.tableIdAttribute
          );
          thisBooking.table = parseInt(resultElement);

          // console.log(resultElement);
        }
      });
    }
  }

  addBooking() {
    const thisBooking = this;

    const starters = document.querySelectorAll('input[name=starter]');
    const birthday = document.querySelectorAll('input[name=birthday]');
    const kidsmenu = document.querySelectorAll('input[name=kidsmenu]');

    const startersArray = [];
    const birthdayArray = [];
    const kidsmenuArray = [];

    for (let starter of starters) {
      if (starter.checked == true) {
        const value = starter.getAttribute('value');
        startersArray.push(value);
        console.log(startersArray);
      }
    }

    for (let tick of birthday) {
      if (tick.checked == true) {
        const value = tick.getAttribute('value');
        birthdayArray.push(value);
      }
    }

    for (let tick of kidsmenu) {
      if (tick.checked == true) {
        const value = tick.getAttribute('value');
        kidsmenuArray.push(value);
      }
    }

    thisBooking.name = document.querySelector(select.booking.name);
    thisBooking.phoneNumber = document.querySelector(
      select.booking.phoneNumber
    );
    thisBooking.emailAddress = document.querySelector(
      select.booking.emailAddress
    );

    const url = settings.db.url + '/' + settings.db.booking;
    console.log(url);

    const payload = {
      name: thisBooking.name.value,
      phone: thisBooking.phoneNumber.value,
      mail: thisBooking.emailAddress.value,
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.table,
      ppl: thisBooking.peopleAmount.value,
      duration: thisBooking.hoursAmount.value,
      starters: startersArray,
      birthday: birthdayArray,
      kidsmenu: kidsmenuArray,
    };

    console.log(thisBooking.emailAddress.value);
    console.log(thisBooking.phoneNumber.value);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }
}
