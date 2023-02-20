/**
 * @module TextDecoration
 */

import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */
import Text, { TextError, TextEvent } from './Text.js';
/**
 * @typedef {import("./Text.js").TextOptions} TextOptions
 * @typedef {import("./Text.js").TextSerialised} TextSerialised
 */

export class TextDecorationError extends TextError {}

export class TextDecorationEvent extends TextEvent {}

/**
 * @typedef TextDecorationOptions
 * @prop {"textbf" | "textit" | "underline"} decoration
 */

/**
 * @typedef TextDecorationSerialised
 * @prop {"textbf" | "textit" | "underline"} decoration
 */

/**
 * @author Joseph Abbey
 * @date 19/02/2023
 * @function
 * @param {"textbf" | "textit" | "underline"} decoration
 *
 * @description Applies the given decoration to the selection.
 */
function decorate(decoration) {
  var selection = window.getSelection();
  switch (selection?.type) {
    case 'Caret':
      var el = Element.map.get(selection.anchorNode?.parentElement?.id ?? '');
      if (el instanceof Text) {
        var t = new Text({
          id: Element.uuid(),
          text: el.text.substring(selection.anchorOffset),
        });
        var e = new TextDecoration({
          id: Element.uuid(),
          text: '',
          decoration: decoration,
        });
        el.parent?.insertChildAfter(e, el);
        el.parent?.insertChildAfter(t, e);
        el.text = el.text.substring(0, selection.anchorOffset);
        e.dom.focus();
      }
      break;
    case 'Range':
      var el = Element.map.get(selection.anchorNode?.parentElement?.id ?? '');
      if (el instanceof Text) {
        var start = Math.min(selection.anchorOffset, selection.focusOffset);
        var end = Math.max(selection.anchorOffset, selection.focusOffset);
        var a = el.text.substring(0, end);
        var b = a.substring(0, start);
        var c = a.substring(start);
        var d = el.text.substring(end);
        var f = new TextDecoration({
          id: Element.uuid(),
          text: c,
          decoration: decoration,
        });
        el.parent?.insertChildAfter(f, el);
        el.parent?.insertChildAfter(
          new Text({
            id: Element.uuid(),
            text: d,
          }),
          f
        );
        el.text = b;
        f.dom.focus();
      }
      break;
    default:
  }
}

/**
 * @author Joseph Abbey
 * @date 19/02/2023
 * @function
 *
 * @description Makes the selected text italic.
 */
export function bold() {
  decorate('textbf');
}

/**
 * @author Joseph Abbey
 * @date 19/02/2023
 * @function
 *
 * @description Underlines the selected text.
 */
export function italic() {
  decorate('textit');
}

/**
 * @author Joseph Abbey
 * @date 19/02/2023
 * @function
 *
 * @description Makes the selected text bold.
 */
export function underline() {
  decorate('underline');
}

/**
 * @author Joseph Abbey
 * @date 19/02/2023
 * @constructor
 * @extends {Text}
 *
 * @description An element representing a LaTeX TextDecoration.
 */
export default class TextDecoration extends Text {
  static type = 'TextDecoration';

  /**
   * @author Joseph Abbey
   * @date 19/02/2023
   * @type {ElementSerialised & TextSerialised & TextDecorationSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      decoration: this.decoration,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 19/02/2023
   * @param {ElementOptions & TextOptions & TextDecorationOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.decoration)
      throw new TextDecorationError('A decoration type must be provided.');
    this.decoration = options.decoration;
  }

  /**
   * @author Joseph Abbey
   * @date 19/02/2023
   * @type {"textbf" | "textit" | "underline"}
   *
   * @description The title of the article. `\{%}`
   */
  decoration;

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id; //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.innerText = this.text;
    this._dom.contentEditable = 'true';
    this._dom.spellcheck = this.article?.spellcheck ?? false;
    this._dom.autocapitalize = 'sentences';
    switch (this.decoration) {
      case 'textbf':
        this._dom.style.fontWeight = 'bold';
        break;
      case 'textit':
        this._dom.style.fontStyle = 'italic';
        break;
      case 'underline':
        this._dom.style.textDecoration = 'underline';
        break;
      default:
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

  get tex() {
    return `\\${this.decoration}{${this.text}}`;
  }
}

TextDecoration.register();
