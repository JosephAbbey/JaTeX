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
  static classes = super.classes + ' ' + this.type;

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
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    //@ts-expect-error
    this._dom.classList.add(this.constructor.type);
    // var s = document.createElement('style');
    // s.innerHTML = `
    // #${this.id} {
    //   break-after: page;
    //   width: calc(100% + 10rem - 1rem);
    //   transform: translateX(-5rem);
    //   border-color: var(--background-color);
    //   margin-block: 4rem;
    //   border-width: 0.5rem;
    //   border-style: solid;
    // }

    // @media print {
    //   #${this.id} {
    //     visibility: hidden;
    //   }
    // }`;
    // this._dom.appendChild(s);
  }
  createDom() {
    this._dom = document.createElement('hr');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return '\\newpage\n';
  }
}

NewPage.register();
