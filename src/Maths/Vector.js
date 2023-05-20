import Element, { ElementError, ElementEvent } from '../Element.js';
import { MathsError, Variable } from '../Maths.js';
/**
 * @typedef {import("../Element.js").ElementOptions} ElementOptions
 * @typedef {import("../Element.js").ElementSerialised} ElementSerialised
 */

/**
 * @author Joseph Abbey
 * @date 05/02/2023
 * @constructor
 * @extends {Variable}
 *
 * @description An element representing a vector in a LaTeX maths environment.
 */
export default class Vector extends Variable {
  static type = 'Vector';
  static classes = super.classes + ' ' + this.type;

  get tex() {
    return '\\vec{' + super.tex + '}';
  }
}

Vector.register();
