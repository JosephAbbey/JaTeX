/**
 * @module Paragraph
 */

import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 */

export class ParagraphError extends ElementError {}

export class ParagraphEvent extends ElementEvent {}

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX paragraph.
 */
export default class Paragraph extends Element {
  static type = 'Paragraph';

  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  createDom() {
    this._dom = document.createElement('p');
    this._dom.style.textAlign = 'justify';
    this._dom.style.textIndent = '2em';
    this._dom.style.margin = '0';
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return '\n' + this.ctex + '\n';
  }
}

Paragraph.register();
