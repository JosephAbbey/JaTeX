import Element, { ElementError } from '../Element.js';
import { MathsError } from '../Maths.js';
/**
 * @typedef {import("../Element.js").ElementOptions} ElementOptions
 * @typedef {import("../Element.js").ElementSerialised} ElementSerialised
 */

/**
 * @typedef MathsOptions
 * @prop {string} environment
 * @prop {boolean} numbered
 */

/**
 * @typedef MathsSerialised
 * @prop {string} environment
 * @prop {boolean} numbered
 */

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX maths environment.
 */
export default class Maths extends Element {
  static type = 'Maths';
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & MathsSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      environment: this.environment,
      numbered: this.numbered,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @param {ElementOptions & MathsOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.environment)
      throw new MathsError('An environment must be provided.');
    this.environment = options.environment;

    this.numbered = options.numbered ?? false;
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
    this._dom.className = this.constructor.classes;
    this._dom.style.fontFamily = 'math';
    this._dom.style.overflowWrap = 'none';
    var s = document.createElement('style');
    s.innerHTML = `
    #${this.id}, #${this.id} :not(sup, sub) {
      text-align: center;
      vertical-align: middle;
    }`;
    this._dom.append(s, ...this.cdom);
  }
  createDom() {
    this._dom = document.createElement('div');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return (
      `\\begin{${this.environment}${this.numbered ? '' : '*'}}\n\n` +
      this.ctex +
      `\n\n\\end{${this.environment}${this.numbered ? '' : '*'}}`
    );
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

Maths.register();
