/**
 * @module TextNormal
 */

import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

export class TextNormalError extends ElementError {}

/**
 * @author Joseph Abbey
 * @date 11/02/2023
 * @constructor
 * @extends {ElementEvent<TextNormal,"edit">}
 *
 * @description Used to trigger textnormal element specific events.
 */
export class TextNormalEvent extends ElementEvent {}

/**
 * @typedef TextNormalOptions
 * @prop {string} text
 */

/**
 * @typedef TextNormalSerialised
 * @prop {string} text
 */

/**
 * @author Joseph Abbey
 * @date 22/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX textnormal.
 */
export default class TextNormal extends Element {
  static type = 'TextNormal';

  /**
   * @author Joseph Abbey
   * @date 22/02/2023
   * @type {ElementSerialised & TextNormalSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      text: this._text,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 22/02/2023
   * @param {ElementOptions & TextNormalOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    // String can be empty, but shouldn't be unless we are immediately focussing it with `.focus()`.
    if (options.text == undefined)
      throw new TextNormalError('Text must be provided.');
    if (options.text == '')
      setTimeout(() => this.dom != document.activeElement && this.delete(), 10);
    this._text = options.text;
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id; //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'initial';
    this._dom.innerText = this.text;
    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
      this._dom.spellcheck = this.article?.spellcheck ?? false;
      this._dom.autocapitalize = 'sentences';
    } else {
      this._dom.contentEditable = 'false';
      this._dom.spellcheck = false;
      this._dom.autocapitalize = 'off';
    }
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener('input', this.handleInput.bind(this));
    this._dom.addEventListener(
      'beforeinput',
      this.handleBeforeInput.bind(this)
    );
    return this._dom;
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleBeforeInput(e) {
    // console.log(e.inputType, 'Before', 'Fired:', e);
    switch (e.inputType) {
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
      default:
      // console.log(e.inputType, 'Before', '  Unhandled.');
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    // console.log(e.inputType, '   After', 'Fired:', e);
    switch (e.inputType) {
      case 'deleteWordBackward':
      case 'deleteWordForward':
      case 'deleteByCut':
      case 'deleteContent':
      case 'deleteContentBackward':
      case 'deleteContentForward':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
      case 'insertText':
        this._title = this.dom.innerText;
        this.dispatchEvent(
          new ElementEvent('edit', this, {
            content: this.dom.innerText,
          })
        );
        // console.log(e.inputType, '   After', '  Handled.');
        break;
      default:
        // console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }

  /**
   * @author Joseph Abbey
   * @date 22/02/2023
   * @protected
   * @type {string}
   * @see {@link text} instead.
   *
   * @description Internal dom cache, use `this.text` instead.
   */
  _text;
  /**
   * @author Joseph Abbey
   * @date 22/02/2023
   * @type {string}
   *
   * @description The text. `\textnormal{%}`
   */
  get text() {
    return this._text;
  }
  set text(s) {
    if (this.article?.readonly) throw new ElementError('Article is readonly.');

    this._text = s;
    // Update the dom.
    if (this._dom) this.dom.innerText = s;

    this.dispatchEvent(
      new ElementEvent('edit', this, {
        content: s,
      })
    );
  }

  get tex() {
    return `\\textnormal{${this.text}}`;
  }
}

TextNormal.register();
