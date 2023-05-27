/**
 * @module Maths
 */

import Element, { ElementError, ElementEvent } from './Element.js';

/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

import { backslash as _backslash } from './index.js';
import SingleCharEditableElement, {
  Approx,
  CDot,
  Comma,
  Equals,
  Minus,
  Plus,
  Variable,
  Vector,
} from './Maths/SingleCharEditableElement.js';
import InlineMaths from './Maths/InlineMaths.js';
import Maths from './Maths/Maths.js';
import Number from './Maths/Number.js';
import Brackets from './Maths/Brackets.js';
import Fraction, { SubFraction } from './Maths/Fraction.js';
import Function from './Maths/Function.js';
import Power from './Maths/Power.js';

export class MathsError extends ElementError {}

/** @extends {ElementEvent<Maths | InlineMaths | import("./Maths.js").Number | Variable | Vector | Brackets | import("./Maths.js").Function | Comma | CDot | Equals | Approx | Minus | Plus | Fraction | Power , "edit">} */
export class MathsEvent extends ElementEvent {}

const commands = /** @type {const} */ ([
  'alpha',
  'beta',
  'gamma',
  'delta',
  'epsilon',
  'zeta',
  'eta',
  'theta',
  'iota',
  'kappa',
  'lamda',
  'mu',
  'nu',
  'xi',
  'pi',
  'rho',
  'sigma',
  'tau',
  'upsilon',
  'phi',
  'chi',
  'psi',
  'omega',
  'approx',
  'cdot',
  'cos',
  'sin',
  'tan',
]);
/** @type {() => Promise<typeof commands[number], void>} */
export const backslash = _backslash.bind(null, commands);

export default Maths;

/**
 * @typedef {import("./Maths/Brackets.js").BracketsOptions} BracketsOptions
 * @typedef {import("./Maths/Brackets.js").BracketsSerialised} BracketsSerialised
 * @typedef {import("./Maths/Fraction.js").FractionOptions} FractionOptions
 * @typedef {import("./Maths/Fraction.js").FractionSerialised} FractionSerialised
 * @typedef {import("./Maths/Function.js").FunctionOptions} FunctionOptions
 * @typedef {import("./Maths/Function.js").FunctionSerialised} FunctionSerialised
 * @typedef {import("./Maths/Maths.js").MathsOptions} MathsOptions
 * @typedef {import("./Maths/Maths.js").MathsSerialised} MathsSerialised
 * @typedef {import("./Maths/Number.js").NumberOptions} NumberOptions
 * @typedef {import("./Maths/Number.js").NumberSerialised} NumberSerialised
 * @typedef {import("./Maths/SingleCharEditableElement.js").VariableOptions} VariableOptions
 * @typedef {import("./Maths/SingleCharEditableElement.js").VariableSerialised} VariableSerialised
 */
export {
  InlineMaths,
  Number,
  Variable,
  Vector,
  Brackets,
  CDot,
  Comma,
  Equals,
  Fraction,
  Function,
  Minus,
  Plus,
  Power,
  SubFraction,
  Approx,
  SingleCharEditableElement,
};
