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
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    this.addEventListener(
      'removeChild',
      () => this.children.length == 0 && this.delete()
    );
    this.addEventListener(
      'spliceChildren',
      () => this.children.length == 0 && this.delete()
    );
  }

  createDom() {
    this._dom = document.createElement('p');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return '\n' + this.ctex + '\n';
  }

  /**
   * Focuses the element in the position specified.
   * @param {number=} position
   *
   * @example el.focus(); // beginning
   * @example el.focus(1);
   * @example el.focus(-1); // end
   */
  focus(position = 0) {
    if (this.children.length == 0) return this.dom.focus();

    if (position == -1)
      return this.children[this.children.length - 1].focus(-1);

    this.children[0].focus(position);
  }
}

Paragraph.register();
