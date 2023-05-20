import Element, { ElementError, ElementEvent } from '../Element.js';
import { MathsError } from '../Maths.js';
/**
 * @typedef {import("../Element.js").ElementOptions} ElementOptions
 * @typedef {import("../Element.js").ElementSerialised} ElementSerialised
 */

import {
  Approx,
  Brackets,
  CDot,
  Equals,
  Fraction,
  Function,
  Minus,
  Number,
  Plus,
  Power,
  SubFraction,
  Variable,
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
