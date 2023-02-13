/**
 * @module PageNumbering
 */

import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

export class PageNumberingError extends ElementError {}

export class PageNumberingEvent extends ElementEvent {}

/**
 * @typedef PageNumberingOptions
 * @prop {string} numbering
 */

/**
 * @typedef PageNumberingSerialised
 * @prop {string} numbering
 */

/**
 * @author Joseph Abbey
 * @date 13/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX page numbering element.
 */
export default class PageNumbering extends Element {
  /**
   * @author Joseph Abbey
   * @date 13/02/2023
   * @type {ElementSerialised & PageNumberingSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      numbering: this.numbering,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 13/02/2023
   * @param {ElementOptions & PageNumberingOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.numbering)
      throw new PageNumberingError('A PageNumbering must be provided.');
    this.numbering = options.numbering;
  }

  /**
   * @author Joseph Abbey
   * @date 13/02/2023
   * @type {string}
   *
   * @description The title of the article. `\pagenumbering{%}`
   */
  numbering;

  get tex() {
    return `\\pagenumbering{${this.numbering}}\n` + this.ctex;
  }
}

PageNumbering.register();
