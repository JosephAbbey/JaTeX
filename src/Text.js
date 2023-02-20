/**
 * @module Text
 */

import Element, { ElementError, ElementEvent } from './Element.js';
import Paragraph from './Paragraph.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

/**
 * @author Joseph Abbey
 * @date 04/02/2023
 * @constructor
 * @extends {ElementError}
 *
 * @description Used to throw text element specific errors.
 */
export class TextError extends ElementError {}

/**
 * @author Joseph Abbey
 * @date 04/02/2023
 * @constructor
 * @extends {ElementEvent<Text,"edit">}
 *
 * @description Used to trigger text element specific events.
 */
export class TextEvent extends ElementEvent {}

/**
 * @typedef TextOptions
 * @prop {string} text
 */

/**
 * @typedef TextSerialised
 * @prop {string} text
 */

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element<TextEvent>}
 *
 * @description An element representing a string of text.
 */
export default class Text extends Element {
  static type = 'Text';

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & TextSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      text: this._text,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @param {ElementOptions & TextOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    // String can be empty, but shouldn't be unless we are immediately focussing it with `.focus()`.
    if (options.text == undefined)
      throw new TextError('Text must be provided.');
    if (options.text == '')
      setTimeout(() => this.dom != document.activeElement && this.delete(), 10);
    this._text = options.text;
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id; //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.innerText = this.text;
    this._dom.contentEditable = 'true';
    //@ts-expect-error
    this._dom.spellcheck = window.spellcheck;
    this._dom.autocapitalize = 'sentences';
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener(
      'beforeinput',
      this.handleBeforeInput.bind(this)
    );
    this._dom.addEventListener('input', this.handleInput.bind(this));
    return this._dom;
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleBeforeInput(e) {
    console.log(e.inputType, 'Before', 'Fired:', e);
    switch (e.inputType) {
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
        console.log(e.inputType, 'Before', '  Canceled.');
        break;
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (
          e.getTargetRanges()[0].startOffset == e.getTargetRanges()[0].endOffset
        ) {
          e.preventDefault();
          if (e.inputType == 'deleteContentBackward') {
            var ps = this.previousSibling;
            if (ps instanceof Text) {
              ps.text = ps.text.substring(0, ps.text.length - 1);
              focusEnd(this.previousSibling?.dom);
            } else if (ps) {
              ps.delete();
              focusEnd(this.previousSibling?.dom);
            } else if (this.parent instanceof Paragraph) {
              var ps1 = this.parent.previousSibling;
              if (ps1 instanceof Paragraph) {
                var p = this.parent;
                ps1.appendChild(...p.children);
                p.delete();
                focusEnd(this.previousSibling?.dom);
                console.log(e.inputType, 'Before', '  Handled.');
              }
            }
          } else {
            var ns = this.nextSibling;
            if (ns instanceof Text) {
              ns.text = ns.text.substring(0, ns.text.length - 1);
              this.nextSibling?.dom?.focus();
            } else if (ns) {
              ns.delete();
              this.nextSibling?.dom?.focus();
            } else if (this.parent instanceof Paragraph) {
              var ns1 = this.parent.nextSibling;
              if (ns1 instanceof Paragraph) {
                this.parent.appendChild(...ns1.children);
                ns1.delete();
                this.nextSibling?.dom?.focus();
                console.log(e.inputType, 'Before', '  Handled.');
              }
            }
          }
          console.log(e.inputType, 'Before', '  Handled.');
        }
        break;
      default:
        console.log(e.inputType, 'Before', '  Unhandled.');
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    console.log(e.inputType, '   After', 'Fired:', e);
    switch (e.inputType) {
      case 'insertParagraph':
        var [p1, p2] = this.dom.innerText.split('\n');
        this.text = p1;
        /**
         * @type {Element[]}
         */
        var c = [new Text({ id: Element.uuid(), text: p2 ?? '' })];
        var cs = this.parent?.children ?? [];
        const index = cs.indexOf(this);
        if (index > -1)
          c.push(...(this.parent?.spliceChildren(index + 1) ?? []));
        this.parent?.parent?.insertChildAfter(
          new Paragraph({
            id: Element.uuid(),
            children: c,
          }),
          this.parent
        );
        c[0].dom.focus();
        console.log(e.inputType, '   After', '  Handled.');
        break;
      case 'deleteWordBackward':
      case 'deleteWordForward':
      case 'deleteByCut':
      case 'deleteContent':
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (this.dom.innerText == '') {
          this.delete();
          if (
            e.inputType == 'deleteContentForward' ||
            e.inputType == 'deleteWordForward'
          ) {
            this.nextSibling?.dom.focus();
          } else {
            focusEnd(this.previousSibling?.dom);
          }
          console.log(e.inputType, '   After', '  Handled.');
          break;
        }
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
      case 'insertText':
        this._text = this.dom.innerText;
        this.dispatchEvent(
          new TextEvent('edit', this, {
            content: this.dom.innerText,
            type: e.inputType,
          })
        );
        console.log(e.inputType, '   After', '  Handled.');
        break;
      default:
        console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @protected
   * @type {string}
   * @see {@link text} instead.
   *
   * @description Internal text variable, use `this.text` instead.
   */
  _text;
  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {string}
   */
  get text() {
    return this._text;
  }
  set text(s) {
    this._text = s;
    // Update the dom.
    if (this._dom) this._dom.innerText = s;
    if (this.text == '') this.delete();
    else
      this.dispatchEvent(
        new TextEvent('edit', this, {
          content: s,
        })
      );
  }

  get tex() {
    return this.text;
  }
}

Text.register();

/**
 * Opens the article.
 * @param {HTMLElement & ElementContentEditable=} node
 */
function focusEnd(node) {
  if (!node) return;
  node.focus();
  const sel = document.getSelection();
  if (!sel) return;
  //@ts-expect-error
  node = node.firstChild;

  if (sel.rangeCount) {
    //@ts-expect-error
    sel.getRangeAt(0)['setStart'](node, node.length);
    //@ts-expect-error
    sel.getRangeAt(0)['setEnd'](node, node.length);
  }
}
