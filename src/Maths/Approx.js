import Element, { ElementError, ElementEvent } from '../Element.js';
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
 * @description An element representing a approx equals in a LaTeX maths environment.
 */
export default class Approx extends SingleCharEditableElement {
  static type = 'Approx';
  static classes = super.classes + ' ' + this.type;

  char = '≈';

  get tex() {
    return ' \\approx ';
  }
}

Approx.register();
