/**
 * @module Font
 */

import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

export class FontError extends ElementError {}

export class FontEvent extends ElementEvent {}

/**
 * @typedef FontOptions
 * @prop {string} font
 */

/**
 * @typedef FontSerialised
 * @prop {string} font
 */

/**
 * @author Joseph Abbey
 * @date 01/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX font.
 */
export default class Font extends Element {
  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & FontSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      font: this.font,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @param {ElementOptions & FontOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.font) throw new FontError('A font must be provided.');
    this.font = options.font;
  }

  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @type {string}
   *
   * @description The title of the article. `\{%}`
   */
  font;

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    this._dom.dataset.type = this.constructor.name;
    this._dom.style.fontFamily = {
      mathrm: 'roman',
      mathsf: 'sans serif',
      mathtt: 'typewriter',
      mathit: 'italic',
      mathbf: 'bold font',
      bm: 'bold symbol',
      mathbb: 'blackboard',
      mathcal: 'calligraphic',
      mathfrak: 'frak',
      mathnormal: 'normal',
    }[this.font];
    this._dom.append(...this.cdom);
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return `\\{${this.font}}\n` + this.ctex;
  }
}

Font.register();
