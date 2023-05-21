import Element, { ElementError, ElementEvent } from '../Element.js';
import {
  Equals,
  MathsError,
  MathsEvent,
  Minus,
  Number,
  Plus,
  Power,
  Variable,
} from '../Maths.js';
import SingleCharEditableElement from './SingleCharEditableElement.js';
/**
 * @typedef {import("../Element.js").ElementOptions} ElementOptions
 * @typedef {import("../Element.js").ElementSerialised} ElementSerialised
 */

/**
 * @typedef SubFractionOptions
 * @prop {boolean} isNumerator
 */

/**
 * @typedef SubFractionSerialised
 * @prop {boolean} isNumerator
 */

/**
 * @author Joseph Abbey
 * @date 11/05/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX numerator or denominator.
 */
export class SubFraction extends Element {
  static type = 'SubFraction';
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 12/05/2023
   * @type {ElementSerialised & SubFractionSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      isNumerator: this.isNumerator,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 11/05/2023
   * @param {ElementOptions & SubFractionOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
    this.isNumerator = options.isNumerator;
    this.addEventListener('removeChild', this.updateDom.bind(this));
    this.addEventListener('spliceChildren', this.updateDom.bind(this));
    // this.addEventListener(
    //   'removeChild',
    //   () => this.children.length == 0 && this.delete()
    // );
    // this.addEventListener(
    //   'spliceChildren',
    //   () => this.children.length == 0 && this.delete()
    // );
  }

  /**
   * @protected
   * @type {boolean}
   */
  isNumerator;

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
    if (this.children.length == 0) {
      this._dom.classList.add('empty');
      if (!this.article?.readonly) {
        this._dom.contentEditable = 'true';
      } else {
        this._dom.contentEditable = 'false';
      }
    } else {
      this._dom.classList.remove('empty');
      this._dom.contentEditable = 'false';
    }
    this._dom.append(...this.cdom);
  }
  createDom() {
    this._dom = document.createElement('div');
    this.updateDom();
    this._dom.addEventListener(
      'beforeinput',
      this.handleBeforeInput.bind(this)
    );
    this._dom.addEventListener('input', this.handleInput.bind(this));
    return this._dom;
  }

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
          if (e.data == '^') {
            let v = new Power({
              id: Element.uuid(),
              children: [],
            });
            this.appendChild(v);
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
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '=') {
            let v = new Equals({
              id: Element.uuid(),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '-') {
            let v = new Minus({
              id: Element.uuid(),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '+') {
            let v = new Plus({
              id: Element.uuid(),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data.toLowerCase() != e.data.toUpperCase()) {
            let v = new Variable({
              id: Element.uuid(),
              var: e.data,
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (
            e.data in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']
          ) {
            let v = new Number({
              id: Element.uuid(),
              num: parseFloat(e.data),
            });
            this.appendChild(v);
            v.focus(-1);
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
            this.previousSibling?.delete(-1);
          } else {
            this.nextSibling?.delete(1);
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

  get tex() {
    return `${this.ctex}`;
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
  focusBefore() {
    if (!this.isNumerator && this.parent instanceof Fraction)
      return this.parent.numerator.focus(-1);
    this.parent?.focusBefore();
  }
  focusAfter() {
    if (this.isNumerator && this.parent instanceof Fraction)
      return this.parent.denominator.focus();
    this.parent?.focusAfter();
  }
}

SubFraction.register();

/**
 * @typedef FractionOptions
 * @prop {SubFraction} numerator
 * @prop {SubFraction} denominator
 */

/**
 * @typedef FractionSerialised
 * @prop {ElementSerialised} numerator
 * @prop {ElementSerialised} denominator
 */

/**
 * @author Joseph Abbey
 * @date 11/05/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a fraction in a LaTeX maths environment.
 */
export default class Fraction extends Element {
  static type = 'Fraction';
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 11/05/2023
   * @type {ElementSerialised & FractionSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      numerator: this.numerator.serialised,
      denominator: this.denominator.serialised,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 11/05/2023
   * @param {ElementSerialised & FractionSerialised} s
   * @returns {Fraction}
   *
   * @description This deserialises an element.
   *
   * @see {@link Fraction~serialised}
   */
  static deserialise(s) {
    // @ts-expect-error
    return super.deserialise({
      ...s,
      numerator: SubFraction.deserialise(s.numerator),
      denominator: SubFraction.deserialise(s.denominator),
    });
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @param {ElementOptions & FractionOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    this.numerator = options.numerator;
    this.numerator.parent = this;
    this.denominator = options.denominator;
    this.denominator.parent = this;
  }

  /**
   * @author Joseph Abbey
   * @date 11/05/2023
   * @type {SubFraction}
   *
   * @description The numerator of the fraction.
   */
  numerator;

  /**
   * @author Joseph Abbey
   * @date 11/05/2023
   * @type {SubFraction}
   *
   * @description The denominator of the fraction.
   */
  denominator;

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
    var hr = document.createElement('hr');
    this._dom.append(this.numerator.dom, hr, this.denominator.dom);
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return `\\frac{${this.numerator.tex}}{${this.denominator.tex}}`;
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
    if (position == -1) return this.denominator.focus(-1);
    this.numerator.focus(position);
  }
}

Fraction.register();
