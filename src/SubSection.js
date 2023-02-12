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
  get titleDom() {
    this._titleDom = document.createElement('h2');
    this.updateTitleDom();
    this._titleDom.addEventListener('input', this.handleInput.bind(this));
    return this._titleDom;
  }

  get tex() {
    return `\\subsection{${this.title}}\n\n` + this.ctex;
  }
}

SubSection.register();
