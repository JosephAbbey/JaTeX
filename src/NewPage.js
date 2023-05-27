/**
 * @module NewPage
 */

import Element, { ElementError, ElementEvent } from './Element.js';
import { Section, SubSection, backslash } from './index.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 */

export class NewPageError extends ElementError {}

export class NewPageEvent extends ElementEvent {}

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX newpage.
 */
export default class NewPage extends Element {
  static type = 'NewPage';
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
    this._dom.className = this.constructor.classes;
  }
  createDom() {
    this._dom = document.createElement('hr');
    this.updateDom();
    this._dom.addEventListener('click', (e) => {
      if (e.offsetX > (this._dom?.offsetWidth ?? 0) - 16) {
        backslash(['section', 'subsection']).then((t) => {
          let v;
          switch (t) {
            case 'section':
              v = new Section({
                id: Element.uuid(),
                title: 'New section',
                children: [],
              });
              if (this.parent instanceof SubSection) {
                this.parent.parent?.parent?.insertChildAfter(
                  v,
                  this.parent.parent
                );
              } else if (this.parent instanceof Section) {
                this.parent.parent?.insertChildAfter(v, this.parent);
              }
              v.focus(-1);
              break;
            case 'subsection':
              v = new SubSection({
                id: Element.uuid(),
                title: 'New subsection',
                children: [],
              });
              if (this.parent instanceof SubSection) {
                this.parent.parent?.insertChildAfter(v, this.parent);
              } else if (this.parent instanceof Section) {
                this.parent.insertChildAfter(v, this);
              }
              v.focus(-1);
              break;
            default:
              break;
          }
        });
      }
    });
    return this._dom;
  }

  get tex() {
    return '\\newpage\n';
  }
}

NewPage.register();
