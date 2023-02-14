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
    this._dom.dataset.type = this.constructor.name;
    var style = document.createElement('style');
    style.innerHTML = `
    #${this.id} [contenteditable] {
      outline: 0px solid transparent;
    }

    #${this.id} {
      background-color: white;
      counter-reset: sectionCount subsectionCount;
    }

    @media not print {
      #${this.id} {
        padding-block: 3em;
        padding-inline: 5em;
      }
    }

    #${this.id} [data-type='Section'] > h2 {
      counter-increment: sectionCount 1;
      counter-reset: subsectionCount;
    }

    #${this.id} [data-type='Section'] > h2:before {
      content: counter(sectionCount) ' ';
    }

    #${this.id} [data-type='SubSection'] > h3 {
      counter-increment: subsectionCount 1;
    }

    #${this.id} [data-type='SubSection'] > h3:before {
      content: counter(sectionCount) '.' counter(subsectionCount) ' ';
    }`;
    this._dom.append(style, ...this.cdom);
  }

  get tex() {
    return '\\begin{document}\n\n' + this.ctex + '\n\n\\end{document}';
  }
}

Document.register();
