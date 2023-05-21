import Element, { ElementError, ElementEvent } from '../Element.js';
import { MathsError, MathsEvent } from '../Maths.js';
/**
 * @typedef {import("../Element.js").ElementOptions} ElementOptions
 * @typedef {import("../Element.js").ElementSerialised} ElementSerialised
 */

import {
  Brackets,
  Fraction,
  Function,
  Number,
  Power,
  SubFraction,
  backslash,
} from '../Maths.js';

/**
 * @abstract
 * @constructor
 * @extends {Element}
 */
export default class SingleCharEditableElement extends Element {
  static type = 'SingleCharEditableElement';
  static classes = super.classes + ' ' + this.type;

  char = ' ';
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener('keydown', (e) => {
      this._position = window.getSelection()?.getRangeAt(0).startOffset;
      if (e.key == 'ArrowLeft') {
        if (this._position == 0) this.focusBefore();
      } else if (e.key == 'ArrowRight') {
        if (this._position == 1) this.focusAfter();
      }
    });
    this._dom.addEventListener(
      'beforeinput',
      this.handleBeforeInput.bind(this)
    );
    this._dom.addEventListener('input', this.handleInput.bind(this));
    return this._dom;
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
    this._dom.innerText = this.char;

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }

  /**
   * @protected
   * @type {number | undefined}
   */
  _position;
  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleBeforeInput(e) {
    if (e.target != this.dom) return;
    // console.log(e.inputType, 'Before', 'Fired:', e);
    switch (e.inputType) {
      case 'insertText':
        e.preventDefault();
        if (e.data) {
          if (e.data == '\\') {
            backslash().then(
              (t) => {
                let v;
                switch (t) {
                  case 'approx':
                    v = new Approx({
                      id: Element.uuid(),
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    break;
                  case 'cdot':
                    v = new CDot({
                      id: Element.uuid(),
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    break;
                  case 'sin':
                    v = new Function({
                      id: Element.uuid(),
                      func: 'sin',
                      children: [],
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    break;
                  case 'cos':
                    v = new Function({
                      id: Element.uuid(),
                      func: 'cos',
                      children: [],
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    break;
                  case 'tan':
                    v = new Function({
                      id: Element.uuid(),
                      func: 'tan',
                      children: [],
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    break;
                  case 'alpha':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'α',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'beta':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'β',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'gamma':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'γ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'delta':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'δ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'epsilon':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'ε',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'zeta':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'ζ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'eta':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'η',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'theta':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'θ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'iota':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'ι',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'kappa':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'κ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'lamda':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'λ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'mu':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'μ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'nu':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'ν',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'xi':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'ξ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'pi':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'π',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'rho':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'ρ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'sigma':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'σ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'tau':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'τ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'upsilon':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'υ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'phi':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'φ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'chi':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'χ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'psi':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'ψ',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  case 'omega':
                    v = new Variable({
                      id: Element.uuid(),
                      var: 'ω',
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    e.preventDefault();
                    break;
                  default:
                    break;
                }
              },
              () => {}
            );

            e.preventDefault();
            break;
          } else if (e.data == '^') {
            let v = new Power({
              id: Element.uuid(),
              children: [],
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '/') {
            let v = new Fraction({
              id: Element.uuid(),
              numerator: new SubFraction({
                id: Element.uuid(),
                children: [],
                isNumerator: true,
              }),
              denominator: new SubFraction({
                id: Element.uuid(),
                children: [],
                isNumerator: false,
              }),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '=') {
            let v = new Equals({
              id: Element.uuid(),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '-') {
            let v = new Minus({
              id: Element.uuid(),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '+') {
            let v = new Plus({
              id: Element.uuid(),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '(') {
            let v = new Brackets({
              id: Element.uuid(),
              children: [],
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '[') {
            let v = new Brackets({
              id: Element.uuid(),
              square: true,
              children: [],
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data.toLowerCase() != e.data.toUpperCase()) {
            let v = new Variable({
              id: Element.uuid(),
              var: e.data,
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (
            e.data in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']
          ) {
            if (this._position == 0 && this.previousSibling instanceof Number) {
              this.previousSibling.text += e.data;
              this.previousSibling.focus(-1);
            } else if (
              this._position == 1 &&
              this.nextSibling instanceof Number
            ) {
              this.nextSibling.text = e.data + this.nextSibling.text;
              this.nextSibling.focus(1);
            } else {
              let v = new Number({
                id: Element.uuid(),
                num: parseFloat(e.data),
              });
              if (this._position == 0) this.parent?.insertChildBefore(v, this);
              else this.parent?.insertChildAfter(v, this);
              v.focus(-1);
            }
            e.preventDefault();
          }
        }
        // console.log(e.inputType, '   After', '  Handled.');
        break;
      case 'insertParagraph':
        e.preventDefault();
      case 'historyUndo':
      case 'historyRedo':
      case 'insertLineBreak':
      case 'insertOrderedList':
      case 'insertUnorderedList':
      case 'insertHorizontalRule':
      case 'insertFromYank':
      case 'insertFromDrop':
      case 'insertFromPasteAsQuotation':
      case 'insertLink':
      case 'deleteSoftLineBackward':
      case 'deleteSoftLineForward':
      case 'deleteEntireSoftLine':
      case 'deleteHardLineBackward':
      case 'deleteHardLineForward':
      case 'deleteByDrag':
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'formatStrikeThrough':
      case 'formatSuperscript':
      case 'formatSubscript':
      case 'formatJustifyFull':
      case 'formatJustifyCenter':
      case 'formatJustifyRight':
      case 'formatJustifyLeft':
      case 'formatIndent':
      case 'formatOutdent':
      case 'formatRemove':
      case 'formatSetBlockTextDirection':
      case 'formatSetInlineTextDirection':
      case 'formatBackColor':
      case 'formatFontColor':
      case 'formatFontName':
        e.preventDefault();
        // console.log(e.inputType, 'Before', '  Canceled.');
        break;
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (
          e.getTargetRanges()[0].startOffset == e.getTargetRanges()[0].endOffset
        ) {
          e.preventDefault();
          if (e.inputType == 'deleteContentBackward') {
            if (this.previousSibling) this.previousSibling.delete(-1);
            else if (this.parent instanceof Brackets) this.parent.remove();
          } else {
            if (this.nextSibling) this.nextSibling.delete(1);
            else if (this.parent instanceof Brackets) this.parent.remove();
          }
          // console.log(e.inputType, 'Before', '  Handled.');
        }
        break;
      default:
      // console.log(e.inputType, 'Before', '  Unhandled.');
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    if (e.target != this.dom) return;
    // console.log(e.inputType, '   After', 'Fired:', e);
    switch (e.inputType) {
      case 'deleteWordBackward':
      case 'deleteWordForward':
      case 'deleteByCut':
      case 'deleteContent':
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (this.dom.innerText == '') {
          this.delete();
          if (
            e.inputType == 'deleteContentForward' ||
            e.inputType == 'deleteWordForward'
          )
            this.focusAfter();
          else this.focusBefore();

          // console.log(e.inputType, '   After', '  Handled.');
          break;
        }
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
        e.preventDefault();
        break;
      default:
        // console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }
}

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a approx equals in a LaTeX maths environment.
 */
export class Approx extends SingleCharEditableElement {
  static type = 'Approx';
  static classes = super.classes + ' ' + this.type;

  char = '≈';

  get tex() {
    return ' \\approx ';
  }
}

Approx.register();

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a c-dot in a LaTeX maths environment.
 */
export class CDot extends SingleCharEditableElement {
  static type = 'CDot';
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  char = '●';

  get tex() {
    return '\\cdot';
  }
}

CDot.register();

/**
 * @author Joseph Abbey
 * @date 02/02/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a comma in a LaTeX maths environment.
 */
export class Comma extends SingleCharEditableElement {
  static type = 'Comma';
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  char = ',';

  get tex() {
    return ', ';
  }
}

Comma.register();

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a equals in a LaTeX maths environment.
 */
export class Equals extends SingleCharEditableElement {
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

/**
 * @author Joseph Abbey
 * @date 07/05/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a minus in a LaTeX maths environment.
 */
export class Minus extends SingleCharEditableElement {
  static type = 'Minus';
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 07/05/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  char = '-';

  get tex() {
    return ' - ';
  }
}

Minus.register();

/**
 * @author Joseph Abbey
 * @date 07/05/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a plus in a LaTeX maths environment.
 */
export class Plus extends SingleCharEditableElement {
  static type = 'Plus';
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 07/05/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  char = '+';

  get tex() {
    return ' + ';
  }
}

Plus.register();

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
export class Variable extends SingleCharEditableElement {
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

/**
 * @author Joseph Abbey
 * @date 05/02/2023
 * @constructor
 * @extends {Variable}
 *
 * @description An element representing a vector in a LaTeX maths environment.
 */
export class Vector extends Variable {
  static type = 'Vector';
  static classes = super.classes + ' ' + this.type;

  get tex() {
    return '\\vec{' + super.tex + '}';
  }
}

Vector.register();
