import Element, { ElementError, ElementEvent } from '../Element.js';
import { MathsError } from '../Maths.js';
/**
 * @typedef {import("../Element.js").ElementOptions} ElementOptions
 * @typedef {import("../Element.js").ElementSerialised} ElementSerialised
 */

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX inline maths environment.
 */
export default class InlineMaths extends Element {
  static type = 'InlineMaths';
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
    this._dom.style.fontFamily = 'math';
    this._dom.style.whiteSpace = 'nowrap';
    var s = document.createElement('style');
    s.innerHTML = `
    #${this.id}, #${this.id} :not(sup, sub) {
      text-align: center;
      vertical-align: middle;
    }`;
    this._dom.append(s, ...this.cdom);
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener('click', (e) => {
      if (e.altKey) {
        if (e.shiftKey) this.desmos();
        else this.wolfram_alpha();
      }
    });
    return this._dom;
  }

  /**
   * @protected
   * @author Joseph Abbey
   * @date 19/02/2023
   * @param {string} l - The link to open
   *
   * @description Opens a popup window.
   */
  open(l) {
    window.open(l, '_blank', 'popup');
  }

  /**
   * @author Joseph Abbey
   * @date 19/02/2023
   *
   * @description Opens this expression in desmos in a popup window.
   */
  desmos() {
    this.open(
      'https://www.desmos.com/calculator?latex=' + encodeURIComponent(this.ctex)
    );
  }

  /**
   * @author Joseph Abbey
   * @date 19/02/2023
   *
   * @description Opens this expression in WolframAlpha in a popup window.
   */
  wolfram_alpha() {
    console.log(this.ctex);
    this.open(
      'https://www.wolframalpha.com/input?i=' + encodeURIComponent(this.ctex)
    );
  }

  get tex() {
    return '$' + this.ctex + '$';
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

InlineMaths.register();
