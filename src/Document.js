/**
 * @module Document
 */

import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 */

export class DocumentError extends ElementError {}

export class DocumentEvent extends ElementEvent {}

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX document.
 */
export default class Document extends Element {
  static type = 'Document';
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
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
    this._dom.append(...this.cdom);
  }

  get tex() {
    return '\\begin{document}\n\n' + this.ctex + '\n\n\\end{document}';
  }
}

Document.register();
