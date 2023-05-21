/**
 * @module Maths
 */

import Element, { ElementError, ElementEvent } from './Element.js';

/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

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

const commands = [
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
].sort();
/**
 * @returns {Promise<string, void>} - The text the user entered.
 * @description It creates a text input at the top of the screen.
 */
export function backslash() {
  /**
   * @author Dziad Borowy
   * @see {@link https://stackoverflow.com/questions/9206013/javascript-list-js-implement-a-fuzzy-search#answer-15252131}
   * @param {string} hay - The string to search in.
   * @param {string} needle - The string to search for.
   * @returns {boolean}
   * @description Fuzzy searches in the string and returns whether there is a match.
   */
  function fuzzy(hay, needle) {
    var hay = hay.toLowerCase();
    var n = -1;
    needle = needle.toLowerCase();
    for (var l of needle) if (!~(n = hay.indexOf(l, n + 1))) return false;
    return true;
  }

  return new Promise((resolve, reject) => {
    /** @type {HTMLDialogElement?} */
    var dialog = document.createElement('dialog');
    if (dialog) {
      dialog.id = 'backslash';

      let s = document.createElement('style');
      s.innerHTML = `
                  .container {
                    border-radius: 0.25em;
                    padding: 0.5em;
                    border: solid 1px #fff5;
                  }
                  .container input {
                    width: 20em;
                  }
                  .container:has(:focus-visible) {
                    /* do something */
                    border: solid 1px white;
                  }
                  .container :focus-visible {
                    outline: none;
                  }
                  .container::before {
                    content: "\\\\";
                    font-weight: bolder;
                    padding-inline-end: 0.25em;
                  }
                  .container ~ ul > li {
                    cursor: pointer;
                    list-style: '\\\\';
                  }`;
      dialog.appendChild(s);

      let container = document.createElement('div');
      container.className = 'container';
      let input = document.createElement('input');
      input.style.background = 'transparent';
      input.style.border = 'transparent';
      container.appendChild(input);
      dialog.appendChild(container);
      let options = document.createElement('ul');
      let options_els = commands.map((cmd) => {
        var li = document.createElement('li');
        li.innerText = cmd;
        li.dataset.cmd = cmd;
        options.appendChild(li);
        li.addEventListener(
          'click',
          () => {
            dialog?.close();
            dialog?.remove();
            resolve(cmd);
          },
          false
        );
        return li;
      });
      dialog.appendChild(options);

      input.addEventListener('input', (e) => {
        for (let el of options_els)
          el.style.display = fuzzy(el.dataset.cmd ?? '', input.value ?? '')
            ? 'list-item'
            : 'none';
      });
      input.addEventListener('keypress', ({ key }) => {
        if (key === 'Enter') {
          options
            .querySelector('li:not([style*="display: none"])')
            //@ts-expect-error
            ?.click();
        }
      });

      dialog.addEventListener('close', (e) => {
        reject();
      });
      document.body.appendChild(dialog);
      dialog.showModal();
    }
  });
}

export default Maths;

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
