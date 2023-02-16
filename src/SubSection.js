/**
 * @module SubSection
 */

import Section from './Section.js';

/**
 * @author Joseph Abbey
 * @date 05/02/2023
 * @constructor
 * @extends {Section}
 *
 * @description An element representing a LaTeX subsection.
 */
export default class SubSection extends Section {
  static type = 'SubSection';

  get titleDom() {
    if (!this._titleDom) {
      this._titleDom = document.createElement('h3');
      this.updateTitleDom();
      this._titleDom.addEventListener('input', this.handleInput.bind(this));
    }
    return this._titleDom;
  }

  get tex() {
    return `\n\\subsection{${this.title}}\n` + this.ctex;
  }
}

SubSection.register();
