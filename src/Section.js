/**
 * @module Section
 */

import Element, { ElementError, ElementEvent } from './Element.js';
import Paragraph from './Paragraph.js';
import Text from './Text.js';
import { backslash } from './index.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

export class SectionError extends ElementError {}

/**
 * @author Joseph Abbey
 * @date 11/02/2023
 * @constructor
 * @extends {ElementEvent<Section,"editTitle">}
 *
 * @description Used to trigger section element specific events.
 */
export class SectionEvent extends ElementEvent {}

/**
 * @typedef SectionOptions
 * @prop {string} title
 */

/**
 * @typedef SectionSerialised
 * @prop {string} title
 */

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX section.
 */
export default class Section extends Element {
  static type = 'Section';
  static classes = super.classes + ' ' + this.type;

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & SectionSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      title: this._title,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @param {ElementOptions & SectionOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.title) throw new SectionError('A title must be provided.');
    this._title = options.title;
  }

  update() {
    super.update();
    this.updateTitleDom();
  }

  /** @type {"h1" | "h2" | "h3" | "h4" | "h5" | "h6"} */
  titleElement = 'h2';

  /**
   * @author Joseph Abbey
   * @date 11/02/2023
   * @type {HTMLHeadingElement?}
   * @see {@link titleDom} instead.
   *
   * @description Internal dom cache, use `this.titleDom` instead.
   */
  _titleDom;
  /**
   * @protected
   */
  updateTitleDom() {
    if (!this._titleDom)
      throw new ElementError(
        'Please create a DOM node before you call `updateTitleDom`.'
      );
    this._titleDom.innerText = this.title;
    if (!this.article?.readonly) {
      this._titleDom.contentEditable = 'true';
      this._titleDom.spellcheck = this.article?.spellcheck ?? false;
      this._titleDom.autocapitalize = 'sentences';
    } else {
      this._titleDom.contentEditable = 'false';
      this._titleDom.spellcheck = false;
      this._titleDom.autocapitalize = 'off';
    }
  }
  /**
   * @author Joseph Abbey
   * @date 11/02/2023
   * @type {HTMLHeadingElement}
   *
   * @description Gets or creates the HTMLHeadingElement linked with this instance's title.
   */
  get titleDom() {
    if (!this._titleDom) {
      this._titleDom = document.createElement(this.titleElement);
      this.updateTitleDom();
      this._titleDom.addEventListener('input', this.handleInput.bind(this));
      this._titleDom.addEventListener(
        'beforeinput',
        this.handleBeforeInput.bind(this)
      );
      this._titleDom.addEventListener('click', (e) => {
        if (e.offsetX > (this._titleDom?.offsetWidth ?? 0)) {
          backslash(['section', 'subsection']).then((t) => {
            let v;
            switch (t) {
              case 'section':
                v = new Section({
                  id: Element.uuid(),
                  title: 'New section',
                  children: [],
                });
                if (this instanceof SubSection) {
                  this.parent?.parent?.insertChildAfter(v, this.parent);
                } else {
                  this.parent?.insertChildAfter(v, this);
                }
                v.focus(-1);
                break;
              case 'subsection':
                v = new SubSection({
                  id: Element.uuid(),
                  title: 'New subsection',
                  children: [],
                });
                if (this instanceof SubSection) {
                  this.parent?.insertChildAfter(v, this);
                } else {
                  this.prependChild(v);
                }
                v.focus(-1);
                break;
              default:
                break;
            }
          });
        }
      });
    }
    return this._titleDom;
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

    this._dom.append(this.titleDom, ...this.cdom);
  }
  createDom() {
    this._dom = document.createElement('div');
    this.updateDom();
    return this._dom;
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleBeforeInput(e) {
    if (e.target != this.titleDom) return;
    switch (e.inputType) {
      case 'insertParagraph':
        let v = new Paragraph({
          id: Element.uuid(),
          children: [
            new Text({
              id: Element.uuid(),
              text: '',
              children: [],
            }),
          ],
        });
        this.prependChild(v);
        v.focus();
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
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    if (e.target != this.titleDom) return;
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
        this._title = this.titleDom.innerText;
        this.dispatchEvent(
          new SectionEvent('editTitle', this, {
            content: this.titleDom.innerText,
          })
        );
        break;
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
        this.updateTitleDom();
        break;
      default:
        break;
    }
  }

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @protected
   * @type {string}
   * @see {@link title} instead.
   *
   * @description Internal dom cache, use `this.title` instead.
   */
  _title;
  /**
   * @author Joseph Abbey
   * @date 11/02/2023
   * @type {string}
   *
   * @description The title of the section. `\section{%}`
   */
  get title() {
    return this._title;
  }
  set title(s) {
    if (this.article?.readonly) throw new SectionError('Article is readonly.');

    this._title = s;
    // Update the dom.
    if (this._titleDom) this.titleDom.innerText = s;

    this.dispatchEvent(
      new SectionEvent('editTitle', this, {
        content: s,
      })
    );
  }

  get tex() {
    return `\n\\section{${this.title}}\n` + this.ctex;
  }
}

Section.register();

/**
 * @author Joseph Abbey
 * @date 05/02/2023
 * @constructor
 * @extends {Section}
 *
 * @description An element representing a LaTeX subsection.
 */
export class SubSection extends Section {
  static type = 'SubSection';
  static classes = super.classes + ' ' + this.type;

  titleElement = /** @type {const} */ ('h3');

  get tex() {
    return `\n\\subsection{${this.title}}\n` + this.ctex;
  }
}

SubSection.register();
