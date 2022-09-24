import icons from 'url:../../img/icons.svg'; // parcel 2

export default class View {
  _data;

  /**
   * Render the recieved object tomthe DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render = true] if false, create markup string instead of renderingto the DOM
   * @returns{undefined | string} A markup string is returned if render = false
   * @this {Object} view instance
   * @author Premjeet Sahu
   * @todo Finish implementation
   * @param {*} data
   * @param {*} render
   * @returns
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEL, i) => {
      const curEL = curElements[i];
      // console.log(curEL, newEL.isEqualNode(curEL));

      if (
        !newEL.isEqualNode(curEL) &&
        newEL.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(' * ', newEL.firstChild.nodeValue.trim());
        curEL.textContent = newEL.textContent;
      }
      //Update change Attribute
      if (!newEL.isEqualNode(curEL)) {
        Array.from(newEL.attributes).forEach(attr =>
          curEL.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `<div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
  <div>
    <svg>
      <use href="${icons}#icon-alert-triangle"></use>
    </svg>
  </div>
  <p>${message}</p>
</div> `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `<div class="message">
  <div>
    <svg>
      <use href="${icons}#icon-smile"></use>
    </svg>
  </div>
  <p>${message}</p>
</div> `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
