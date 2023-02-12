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

  get tex() {
    return (
      '\\begin{document}\n\n' +
      '\\pagenumbering{gobble}\n' +
      '\\maketitle\n' +
      '\\newpage\n\n' +
      '\\pagenumbering{arabic}\n\n' +
      this.ctex +
      '\n\n' +
      '\\end{document}'
    );
  }
}

Document.register();
