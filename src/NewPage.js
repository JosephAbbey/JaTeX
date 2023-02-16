/**
 * @module NewPage
 */

import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 */

export class NewPageError extends ElementError {}

export class NewPageEvent extends ElementEvent {}

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX newpage.
 */
export default class NewPage extends Element {
  static type = 'NewPage';

  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.style.pageBreakAfter = 'always';
    this._dom.id = this.id; //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
  }
  createDom() {
    this._dom = document.createElement('div');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return '\\newpage';
  }
}

NewPage.register();
