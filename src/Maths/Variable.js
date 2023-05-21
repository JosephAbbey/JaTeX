import Element, { ElementError, ElementEvent } from '../Element.js';
import { MathsError, MathsEvent } from '../Maths.js';
import SingleCharEditableElement from './SingleCharEditableElement.js';
/**
 * @typedef {import("../Element.js").ElementOptions} ElementOptions
 * @typedef {import("../Element.js").ElementSerialised} ElementSerialised
 */

/**
 * @typedef VariableOptions
 * @prop {string} var
 */

/**
 * @typedef VariableSerialised
 * @prop {string} var
 */

/**
 * @author Joseph Abbey
 * @date 02/02/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a variable in a LaTeX maths environment.
 */
export default class Variable extends SingleCharEditableElement {
  static type = 'Variable';
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & VariableSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      var: this.var,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @param {ElementOptions & VariableOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.var) throw new MathsError('A variable name must be provided.');
    this.char = options.var;
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @type {string}
   */
  char;
  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @type {string}
   */
  get var() {
    return this.char;
  }
  set var(s) {
    if (this.article?.readonly) throw new MathsError('Article is readonly.');

    this.char = s;
    this.updateDom();
    if (this.var == '') this.delete();
    else
      this.dispatchEvent(
        new MathsEvent('edit', this, {
          content: s,
        })
      );
  }

  get tex() {
    switch (this.var) {
      case 'α':
        return '\\alpha';
      case 'β':
        return '\\beta';
      case 'γ':
        return '\\gamma';
      case 'δ':
        return '\\delta';
      case 'ε':
        return '\\epsilon';
      case 'ζ':
        return '\\zeta';
      case 'η':
        return '\\eta';
      case 'θ':
        return '\\theta';
      case 'ι':
        return '\\iota';
      case 'κ':
        return '\\kappa';
      case 'λ':
        return '\\lamda';
      case 'μ':
        return '\\mu';
      case 'ν':
        return '\\nu';
      case 'ξ':
        return '\\xi';
      case 'π':
        return '\\pi';
      case 'ρ':
        return '\\rho';
      case 'σ':
        return '\\sigma';
      case 'τ':
        return '\\tau';
      case 'υ':
        return '\\upsilon';
      case 'φ':
        return '\\phi';
      case 'χ':
        return '\\chi';
      case 'ψ':
        return '\\psi';
      case 'ω':
        return '\\omega';
      default:
        return this.var;
    }
  }
}

Variable.register();
