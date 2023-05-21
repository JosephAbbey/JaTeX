/**
 * @module MakeTitle
 */

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
 * @extends {ElementEvent<MakeTitle, "edit">}
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
  static type = 'MakeTitle';
  static classes = super.classes + ' ' + this.type;

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
    this.article?.maketitles?.push(this);
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    //@ts-expect-error
    this._dom.className = this.constructor.classes;
    this._dom.innerText = this.article?.title ?? 'Unknown';
    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
      this._dom.spellcheck = this.article?.spellcheck ?? false;
      this._dom.autocapitalize = 'words';
    } else {
      this._dom.contentEditable = 'false';
      this._dom.spellcheck = false;
      this._dom.autocapitalize = 'off';
    }
  }
  createDom() {
    this._dom = document.createElement('h1');
    this.updateDom();
    this._dom.addEventListener('input', this.handleInput.bind(this));
    this._dom.addEventListener(
      'beforeinput',
      this.handleBeforeInput.bind(this)
    );
    return this._dom;
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleBeforeInput(e) {
    if (e.target != this.dom) return;
    switch (e.inputType) {
      case 'insertParagraph':
      case 'historyUndo':
      case 'historyRedo':
      case 'insertLineBreak':
      case 'insertOrderedList':
      case 'insertUnorderedList':
      case 'insertHorizontalRule':
      case 'insertFromYank':
      case 'insertFromDrop':
      case 'insertFromPasteAsQuotation':
      case 'insertLink':
      case 'deleteSoftLineBackward':
      case 'deleteSoftLineForward':
      case 'deleteEntireSoftLine':
      case 'deleteHardLineBackward':
      case 'deleteHardLineForward':
      case 'deleteByDrag':
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'formatStrikeThrough':
      case 'formatSuperscript':
      case 'formatSubscript':
      case 'formatJustifyFull':
      case 'formatJustifyCenter':
      case 'formatJustifyRight':
      case 'formatJustifyLeft':
      case 'formatIndent':
      case 'formatOutdent':
      case 'formatRemove':
      case 'formatSetBlockTextDirection':
      case 'formatSetInlineTextDirection':
      case 'formatBackColor':
      case 'formatFontColor':
      case 'formatFontName':
        e.preventDefault();
        break;
      default:
        break;
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    if (e.target != this.dom) return;
    switch (e.inputType) {
      case 'deleteWordBackward':
      case 'deleteWordForward':
      case 'deleteByCut':
      case 'deleteContent':
      case 'deleteContentBackward':
      case 'deleteContentForward':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
      case 'insertText':
        if (this.article) {
          this.article.title = this.dom.innerText;
          this.dispatchEvent(
            new MakeTitleEvent('edit', this, {
              content: this.dom.innerText,
            })
          );
        } else {
          this.dom.innerText = 'Unknown';
        }
        break;
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
        this.updateDom();
        break;
      default:
        break;
    }
  }

  get tex() {
    return `\n\\maketitle\n`;
  }
}

MakeTitle.register();
