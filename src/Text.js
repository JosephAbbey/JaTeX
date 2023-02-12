/**
 * @module Text
 */

import Element, { ElementError, ElementEvent } from './Element.js';
import Paragraph from './Paragraph.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

/**
 * @author Joseph Abbey
 * @date 04/02/2023
 * @constructor
 * @extends {ElementError}
 *
 * @description Used to throw text element specific errors.
 */
export class TextError extends ElementError {}

/**
 * @author Joseph Abbey
 * @date 04/02/2023
 * @constructor
 * @extends {ElementEvent<Text,"edit">}
 *
 * @description Used to trigger text element specific events.
 */
export class TextEvent extends ElementEvent {}

/**
 * @typedef TextOptions
 * @prop {string} text
 */

/**
 * @typedef TextSerialised
 * @prop {string} text
 */

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element<TextEvent>}
 *
 * @description An element representing a string of text.
 */
export default class Text extends Element {
  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & TextSerialised}
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
   * @date 29/01/2023
   * @param {ElementOptions & TextOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    // String can be empty, but shouldn't be unless we are immediately focussing it with `.focus()`.
    if (options.text == undefined)
      throw new TextError('Text must be provided.');
    this._text = options.text;
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    this._dom.dataset.type = this.constructor.name;
    this._dom.innerText = this.text;
    this._dom.contentEditable = 'true';
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener('input', this.handleInput.bind(this));
    return this._dom;
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    switch (e.inputType) {
      case 'insertParagraph':
        var [p1, p2] = this.dom.innerText.split('\n');
        this.text = p1;
        /**
         * @type {Element[]}
         */
        var c = [new Text({ id: Element.uuid(), text: p2 ?? '' })];
        var cs = this.parent?.children ?? [];
        const index = cs.indexOf(this);
        if (index > -1)
          c.push(...(this.parent?.spliceChildren(index + 1) ?? []));
        this.parent?.parent?.insertChildAfter(
          new Paragraph({
            id: Element.uuid(),
            children: c,
          }),
          this.parent
        );
        c[0].dom.focus();
        break;
      case 'historyUndo':
      case 'historyRedo':
      case 'deleteContentBackward':
      case 'deleteContentForward':
      case 'insertText':
        this._text = this.dom.innerText;
        if (this.text == '') this.delete();
        else
          this.dispatchEvent(
            new TextEvent('edit', this, {
              content: this.dom.innerText,
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
   * @see {@link text} instead.
   *
   * @description Internal text variable, use `this.text` instead.
   */
  _text;
  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {string}
   */
  get text() {
    return this._text;
  }
  set text(s) {
    this._text = s;
    // Update the dom.
    if (this._dom) this._dom.innerText = s;
    if (this.text == '') this.delete();
    else
      this.dispatchEvent(
        new TextEvent('edit', this, {
          content: this.dom.innerText,
        })
      );
  }

  get tex() {
    return this.text;
  }
}

Text.register();
