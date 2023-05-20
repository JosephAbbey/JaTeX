import Element, { ElementError, ElementEvent } from '../Element.js';
import { MathsError, MathsEvent } from '../Maths.js';
import SingleCharEditableElement from './SingleCharEditableElement.js';
/**
 * @typedef {import("../Element.js").ElementOptions} ElementOptions
 * @typedef {import("../Element.js").ElementSerialised} ElementSerialised
 */

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a equals in a LaTeX maths environment.
 */
export default class Equals extends SingleCharEditableElement {
  static type = 'Equals';
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  char = '=';

  get tex() {
    return ' &= ';
  }
}

Equals.register();
