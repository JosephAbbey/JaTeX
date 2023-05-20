/**
 * @module TextNormal
 */

import { ElementError } from './Element.js';
import Text from './Text.js';

/**
 * @author Joseph Abbey
 * @date 22/02/2023
 * @constructor
 * @extends {Text}
 *
 * @description An element representing a LaTeX textnormal.
 */
export default class TextNormal extends Text {
  static type = 'TextNormal';
  static classes = super.classes + ' ' + this.type;

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

  get tex() {
    return `\\textnormal{${this.text}}`;
  }
}

TextNormal.register();
