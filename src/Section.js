/**
 * @module Section
 */

import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

export class SectionError extends ElementError {}

/**
 * @author Joseph Abbey
 * @date 11/02/2023
 * @constructor
 * @extends {ElementEvent<Section,"editTitle">}
 *
 * @description Used to trigger section element specific events.
 */
export class SectionEvent extends ElementEvent {}

/**
 * @typedef SectionOptions
 * @prop {string} title
 */

/**
 * @typedef SectionSerialised
 * @prop {string} title
 */

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX section.
 */
export default class Section extends Element {
  static type = 'Section';

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & SectionSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      title: this._title,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @param {ElementOptions & SectionOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.title) throw new SectionError('A title must be provided.');
    this._title = options.title;
  }

  update() {
    super.update();
    this.updateTitleDom();
  }

  /**
   * @author Joseph Abbey
   * @date 11/02/2023
   * @type {HTMLHeadingElement}
   * @see {@link titleDom} instead.
   *
   * @description Internal dom cache, use `this.titleDom` instead.
   */
  _titleDom;
  /**
   * @protected
   */
  updateTitleDom() {
    if (!this._titleDom)
      throw new ElementError(
        'Please create a DOM node before you call `updateTitleDom`.'
      );
    this._titleDom.innerText = this.title;
    if (!this.article?.readonly) {
      this._titleDom.contentEditable = 'true';
      this._titleDom.spellcheck = this.article?.spellcheck ?? false;
      this._titleDom.autocapitalize = 'sentences';
    } else {
      this._titleDom.contentEditable = 'false';
      this._titleDom.spellcheck = false;
      this._titleDom.autocapitalize = 'off';
    }
  }
  /**
   * @author Joseph Abbey
   * @date 11/02/2023
   * @type {HTMLHeadingElement}
   *
   * @description Gets or creates the HTMLHeadingElement linked with this instance's title.
   */
  get titleDom() {
    if (!this._titleDom) {
      this._titleDom = document.createElement('h2');
      this.updateTitleDom();
      this._titleDom.addEventListener('input', this.handleInput.bind(this));
      this._titleDom.addEventListener(
        'beforeinput',
        this.handleBeforeInput.bind(this)
      );
    }
    return this._titleDom;
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id; //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;

    this._dom.append(this.titleDom, ...this.cdom);
  }
  createDom() {
    this._dom = document.createElement('div');
    this.updateDom();
    return this._dom;
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleBeforeInput(e) {
    console.log(e.inputType, 'Before', 'Fired:', e);
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
        console.log(e.inputType, 'Before', '  Canceled.');
        break;
      default:
        console.log(e.inputType, 'Before', '  Unhandled.');
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    console.log(e.inputType, '   After', 'Fired:', e);
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
        this._title = this.titleDom.innerText;
        this.dispatchEvent(
          new SectionEvent('editTitle', this, {
            content: this.titleDom.innerText,
          })
        );
        console.log(e.inputType, '   After', '  Handled.');
        break;
      default:
        console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @protected
   * @type {string}
   * @see {@link title} instead.
   *
   * @description Internal dom cache, use `this.title` instead.
   */
  _title;
  /**
   * @author Joseph Abbey
   * @date 11/02/2023
   * @type {string}
   *
   * @description The title of the section. `\section{%}`
   */
  get title() {
    return this._title;
  }
  set title(s) {
    if (this.article?.readonly) throw new SectionError('Article is readonly.');

    this._title = s;
    // Update the dom.
    if (this._titleDom) this.titleDom.innerText = s;

    this.dispatchEvent(
      new SectionEvent('editTitle', this, {
        content: s,
      })
    );
  }

  get tex() {
    return `\n\\section{${this.title}}\n` + this.ctex;
  }
}

Section.register();
