/**
 * @module Section
 */

import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

export class SectionError extends ElementError {}

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
    this._titleDom.contentEditable = 'true';
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
      this._titleDom = document.createElement('h1');
      this.updateTitleDom();
      this._titleDom.addEventListener('input', this.handleInput.bind(this));
    }
    return this._titleDom;
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    this._dom.dataset.type = this.constructor.name;

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
  handleInput(e) {
    switch (e.inputType) {
      case 'insertParagraph':
        this.titleDom.innerText = this.titleDom.innerText.replace('\n', '');
        break;
      case 'historyUndo':
      case 'historyRedo':
      case 'deleteContentBackward':
      case 'deleteContentForward':
      case 'insertText':
        this._title = this.titleDom.innerText;
        this.dispatchEvent(
          new SectionEvent('editTitle', this, {
            content: this.titleDom.innerText,
          })
        );
        break;
      default:
        console.log(e);
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
    this._title = s;
    // Update the dom.
    if (this._titleDom) this.titleDom.innerText = s;

    this.dispatchEvent(
      new SectionEvent('editTitle', this, {
        content: this.titleDom.innerText,
      })
    );
  }

  get tex() {
    return `\\section{${this.title}}\n\n` + this.ctex;
  }
}

Section.register();
