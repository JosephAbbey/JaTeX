/**
 * @module MakeTitle
 */

import { ArticleEvent } from './Article.js';
import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

export class MakeTitleError extends ElementError {}

/**
 * @author Joseph Abbey
 * @date 13/02/2023
 * @constructor
 * @extends {ElementEvent<MakeTitle,"editTitle">}
 *
 * @description Used to trigger maketitle element specific events.
 */
export class MakeTitleEvent extends ElementEvent {}

/**
 * @author Joseph Abbey
 * @date 13/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX MakeTitle.
 */
export default class MakeTitle extends Element {
  /**
   * @author Joseph Abbey
   * @date 13/02/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
  }

  /**
   * @inheritdoc
   */
  get article() {
    return super.article;
  }
  set article(a) {
    const index =
      this.article?.maketitles.findIndex((e) => e.id == this.id) ?? -1;
    if (index > -1) this.article?.maketitles.splice(index, 1);
    super.article = a;
    this.article?.maketitles.push(this);
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.id = this.id;
    this._dom.dataset.type = this.constructor.name;
    this._dom.innerText = this.article?.title ?? 'Unknown';
    this._dom.contentEditable = 'true';
  }
  createDom() {
    this._dom = document.createElement('h1');
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
        this.dom.innerText = this.dom.innerText.replace('\n', '');
        break;
      case 'historyUndo':
      case 'historyRedo':
      case 'deleteContentBackward':
      case 'deleteContentForward':
      case 'insertText':
        if (this.article) {
          this.article.title = this.dom.innerText;
          this.dispatchEvent(
            new MakeTitleEvent('editTitle', this, {
              content: this.dom.innerText,
            })
          );
        } else {
          this.dom.innerText = 'Unknown';
        }
        break;
      default:
        console.log(e);
        break;
    }
  }

  get tex() {
    return `\n\\maketitle\n`;
  }
}

MakeTitle.register();
