import Element, { ElementError, ElementEvent } from '../Element.js';
import { MathsError } from '../Maths.js';
/**
 * @typedef {import("../Element.js").ElementOptions} ElementOptions
 * @typedef {import("../Element.js").ElementSerialised} ElementSerialised
 */

/**
 * @typedef BracketsOptions
 * @prop {boolean?} [square]
 */

/**
 * @typedef BracketsSerialised
 * @prop {boolean?} [square]
 */

/**
 * @author Joseph Abbey
 * @date 02/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing brackets in a LaTeX maths environment.
 */
export default class Brackets extends Element {
  static type = 'Brackets';
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & BracketsSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      square: this.square,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @param {ElementOptions & BracketsOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    this.square = options.square ?? false;
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
    this._dom.dataset.square = this.square ? 'true' : 'false';
    //@ts-expect-error
    this._dom.className = this.constructor.classes;
    this._dom.append(...this.cdom);
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    return this._dom;
  }

  /** Removes the brackets. */
  remove() {
    while (this.children.length > 0) {
      let c = this.children[0];
      this.removeChild(c);
      this.parent?.insertChildBefore(c, this);
    }
    this.delete();
  }

  /**
   * Deletes the element in the position specified.
   * @param {number=} position
   */
  delete(position) {
    if (position == null || position == 0) return super.delete();
    this.remove();
  }

  get tex() {
    return (this.square ? '[' : '(') + this.ctex + (this.square ? ']' : ')');
  }
}

Brackets.register();
