
class HomePage {
  constructor() {
    const thisHomePage = this;

    thisHomePage.getElements();
  }

  getElements() {
    const thisHomePage = this;
    thisHomePage.feedback = thisHomePage.element.querySelector('row_feedback');

    console.log(thisHomePage.feedback);

  }
}
