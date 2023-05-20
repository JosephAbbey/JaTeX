import Element, { ElementError, ElementEvent } from '../Element.js';
import {
  Equals,
  Fraction,
  MathsError,
  MathsEvent,
  Minus,
  Plus,
  Power,
  SubFraction,
  Variable,
} from '../Maths.js';
/**
 * @typedef {import("../Element.js").ElementOptions} ElementOptions
 * @typedef {import("../Element.js").ElementSerialised} ElementSerialised
 */

/**
 * @typedef NumberOptions
 * @prop {number} num
 */

/**
 * @typedef NumberSerialised
 * @prop {number} num
 */

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a number in a LaTeX maths environment.
 */
export default class Number extends Element {
  static type = 'Number';
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @type {ElementSerialised & NumberSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      num: this.num,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @param {ElementOptions & NumberOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.num) throw new MathsError('A number must be provided.');
    this._num = options.num;
    this._text = options.num.toString();
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
    this._dom.innerText = this.text;

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener('keydown', (e) => {
      this._position = window.getSelection()?.getRangeAt(0).startOffset;
      if (e.key == 'ArrowLeft') {
        if (this._position == 0) this.focusBefore();
      } else if (e.key == 'ArrowRight') {
        if (this._position == this._text.length) this.focusAfter();
      }
    });
    this._dom.addEventListener(
      'beforeinput',
      this.handleBeforeInput.bind(this)
    );
    this._dom.addEventListener('input', this.handleInput.bind(this));
    return this._dom;
  }

  /**
   * @private
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
        if (e.data == '^') {
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
        } else if (e.data) {
          if (e.data.toLowerCase() != e.data.toUpperCase()) {
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
            !(e.data in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'])
          ) {
            e.preventDefault();
          }
        }
        // console.log(e.inputType, '   After', '  Handled.');
        break;
      case 'insertParagraph':
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
            this.previousSibling?.delete();
          } else {
            this.nextSibling?.delete();
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
        // don't need to update the dom
        this._num = parseFloat(this.dom.innerText);
        this._text = this.dom.innerText;
        break;
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
        e.preventDefault();
        break;
      case 'insertText':
        // don't need to update the dom
        this._num = parseFloat(this.dom.innerText);
        this._text = this.dom.innerText;
        this.dispatchEvent(
          new MathsEvent('edit', this, {
            content: this.num,
          })
        );
      default:
        // console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }

  /**
   * Deletes the element in the position specified.
   * @param {number=} position
   *
   * @example el.delete(); // whole
   * @example el.delete(0); // whole
   * @example el.delete(1); // first char
   * @example el.delete(2); // first 2 chars
   * @example el.delete(-2); // last 2 chars
   * @example el.delete(-1); // last char
   */
  delete(position) {
    if (position == null || position == 0) return super.delete();

    if (Math.sign(position) == -1) {
      this.text = this.text.substring(0, position + this.text.length);
    } else {
      this.text = this.text.substring(position);
    }
  }

  /**
   * @author Joseph Abbey
   * @date 06/05/2023
   * @type {string}
   */
  _text;
  /**
   * @author Joseph Abbey
   * @date 06/05/2023
   * @type {string}
   */
  get text() {
    return this._text;
  }
  set text(s) {
    if (this.article?.readonly) throw new MathsError('Article is readonly.');
    if (s.length == 0) this.delete();

    this._num = parseFloat(s);
    this._text = s;

    this.updateDom();

    this.dispatchEvent(
      new MathsEvent('edit', this, {
        content: this.num,
      })
    );
  }

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @type {number}
   */
  _num;
  /**
   * @author Joseph Abbey
   * @date 06/05/2023
   * @type {number}
   */
  get num() {
    return this._num;
  }
  set num(s) {
    if (this.article?.readonly) throw new MathsError('Article is readonly.');

    this._num = s;
    this._text = s.toString();

    this.updateDom();

    this.dispatchEvent(
      new MathsEvent('edit', this, {
        content: this.num,
      })
    );
  }

  get tex() {
    return this.num.toString();
  }
}

Number.register();
