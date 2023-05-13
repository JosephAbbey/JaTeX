/**
 * @module Maths
 */

import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

export class MathsError extends ElementError {}

/** @extends {ElementEvent<Maths | InlineMaths | import("./Maths.js").Number | Variable | Vector | Brackets | import("./Maths.js").Function | Comma | CDot | Equals | Approx | Minus | Fraction | Power , "edit">} */
export class MathsEvent extends ElementEvent {}

/**
 * @typedef MathsOptions
 * @prop {string} environment
 * @prop {boolean} numbered
 */

/**
 * @typedef MathsSerialised
 * @prop {string} environment
 * @prop {boolean} numbered
 */

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX maths environment.
 */
export default class Maths extends Element {
  static type = 'Maths';

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & MathsSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      environment: this.environment,
      numbered: this.numbered,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @param {ElementOptions & MathsOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.environment)
      throw new MathsError('An environment must be provided.');
    this.environment = options.environment;

    this.numbered = options.numbered ?? false;
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
    this._dom.style.fontFamily = 'math';
    this._dom.style.overflowWrap = 'none';
    var s = document.createElement('style');
    s.innerHTML = `
    #${this.id}, #${this.id} :not(sup, sub) {
      text-align: center;
      vertical-align: middle;
    }`;
    this._dom.append(s, ...this.cdom);
  }
  createDom() {
    this._dom = document.createElement('div');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return (
      `\\begin{${this.environment}${this.numbered ? '' : '*'}}\n\n` +
      this.ctex +
      `\n\n\\end{${this.environment}${this.numbered ? '' : '*'}}`
    );
  }

  /**
   * Focuses the element in the position specified.
   * @param {number=} position
   *
   * @example el.focus(); // beginning
   * @example el.focus(1);
   * @example el.focus(-1); // end
   */
  focus(position = 0) {
    if (this.children.length == 0) return this.dom.focus();

    if (position == -1)
      return this.children[this.children.length - 1].focus(-1);

    this.children[0].focus(position);
  }
}

Maths.register();

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX inline maths environment.
 */
export class InlineMaths extends Element {
  static type = 'InlineMaths';

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
    this._dom.style.fontFamily = 'math';
    this._dom.style.whiteSpace = 'nowrap';
    var s = document.createElement('style');
    s.innerHTML = `
    #${this.id}, #${this.id} :not(sup, sub) {
      text-align: center;
      vertical-align: middle;
    }`;
    this._dom.append(s, ...this.cdom);
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener('click', (e) => {
      if (e.altKey) {
        if (e.shiftKey) this.desmos();
        else this.wolfram_alpha();
      }
    });
    return this._dom;
  }

  /**
   * @protected
   * @author Joseph Abbey
   * @date 19/02/2023
   * @param {string} l - The link to open
   *
   * @description Opens a popup window.
   */
  open(l) {
    window.open(l, '_blank', 'popup');
  }

  /**
   * @author Joseph Abbey
   * @date 19/02/2023
   *
   * @description Opens this expression in desmos in a popup window.
   */
  desmos() {
    this.open(
      'https://www.desmos.com/calculator?latex=' + encodeURIComponent(this.ctex)
    );
  }

  /**
   * @author Joseph Abbey
   * @date 19/02/2023
   *
   * @description Opens this expression in WolframAlpha in a popup window.
   */
  wolfram_alpha() {
    console.log(this.ctex);
    this.open(
      'https://www.wolframalpha.com/input?i=' + encodeURIComponent(this.ctex)
    );
  }

  get tex() {
    return '$' + this.ctex + '$';
  }

  /**
   * Focuses the element in the position specified.
   * @param {number=} position
   *
   * @example el.focus(); // beginning
   * @example el.focus(1);
   * @example el.focus(-1); // end
   */
  focus(position = 0) {
    if (this.children.length == 0) return this.dom.focus();

    if (position == -1)
      return this.children[this.children.length - 1].focus(-1);

    this.children[0].focus(position);
  }
}

InlineMaths.register();

const commands = ['approx', 'cdot', 'sin', 'cos', 'tan'];
/**
 * @returns {Promise<string, void>} - The text the user entered.
 * @description It creates a text input at the top of the screen.
 */
function backslash() {
  /**
   * @author Dziad Borowy
   * @see {@link https://stackoverflow.com/questions/9206013/javascript-list-js-implement-a-fuzzy-search#answer-15252131}
   * @param {string} hay - The string to search in.
   * @param {string} needle - The string to search for.
   * @returns {boolean}
   * @description Fuzzy searches in the string and returns whether there is a match.
   */
  function fuzzy(hay, needle) {
    var hay = hay.toLowerCase();
    var n = -1;
    needle = needle.toLowerCase();
    for (var l of needle) if (!~(n = hay.indexOf(l, n + 1))) return false;
    return true;
  }

  return new Promise((resolve, reject) => {
    /** @type {HTMLDialogElement?} */
    var dialog = document.createElement('dialog');
    if (dialog) {
      dialog.id = 'backslash';

      let s = document.createElement('style');
      s.innerHTML = `
                  .container {
                    border-radius: 0.25em;
                    padding: 0.5em;
                    border: solid 1px #fff5;
                  }
                  .container input {
                    width: 20em;
                  }
                  .container:has(:focus-visible) {
                    /* do something */
                    border: solid 1px white;
                  }
                  .container :focus-visible {
                    outline: none;
                  }
                  .container::before {
                    content: "\\\\";
                    font-weight: bolder;
                    padding-inline-end: 0.25em;
                  }
                  .container ~ ul > li {
                    cursor: pointer;
                    list-style: '\\\\';
                  }`;
      dialog.appendChild(s);

      let container = document.createElement('div');
      container.className = 'container';
      let input = document.createElement('input');
      input.style.background = 'transparent';
      input.style.border = 'transparent';
      container.appendChild(input);
      dialog.appendChild(container);
      let options = document.createElement('ul');
      let options_els = commands.map((cmd) => {
        var li = document.createElement('li');
        li.innerText = cmd;
        li.dataset.cmd = cmd;
        options.appendChild(li);
        li.addEventListener(
          'click',
          () => {
            dialog?.close();
            dialog?.remove();
            resolve(cmd);
          },
          false
        );
        return li;
      });
      dialog.appendChild(options);

      input.addEventListener('input', (e) => {
        for (let el of options_els)
          el.style.display = fuzzy(el.dataset.cmd ?? '', input.value ?? '')
            ? 'list-item'
            : 'none';
      });
      input.addEventListener('keypress', ({ key }) => {
        if (key === 'Enter') {
          options
            .querySelector('li:not([style*="display: none"])')
            //@ts-expect-error
            ?.click();
        }
      });

      dialog.addEventListener('close', (e) => {
        reject();
      });
      document.body.appendChild(dialog);
      dialog.showModal();
    }
  });
}

/**
 * @constructor
 * @extends {Element}
 */
export class SingleCharEditableElement extends Element {
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener('keydown', (e) => {
      this._position = window.getSelection()?.getRangeAt(0).startOffset;
      if (e.key == 'ArrowLeft') {
        if (this._position == 0) this.focusBefore();
      } else if (e.key == 'ArrowRight') {
        if (this._position == 1) this.focusAfter();
      }
    });
    this._dom.addEventListener(
      'beforeinput',
      this.handleBeforeInput.bind(this)
    );
    this._dom.addEventListener('input', this.handleInput.bind(this));
    return this._dom;
  }

  /**
   * @protected
   * @type {number | undefined}
   */
  _position;
  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleBeforeInput(e) {
    if (e.target != this.dom) return;
    // console.log(e.inputType, 'Before', 'Fired:', e);
    switch (e.inputType) {
      case 'insertText':
        e.preventDefault();
        if (e.data) {
          if (e.data == '\\') {
            backslash().then(
              (t) => {
                let v;
                switch (t) {
                  case 'approx':
                    v = new Approx({
                      id: Element.uuid(),
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    break;
                  case 'cdot':
                    v = new CDot({
                      id: Element.uuid(),
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    break;
                  case 'sin':
                    v = new Function({
                      id: Element.uuid(),
                      func: 'sin',
                      children: [],
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    break;
                  case 'cos':
                    v = new Function({
                      id: Element.uuid(),
                      func: 'cos',
                      children: [],
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    break;
                  case 'tan':
                    v = new Function({
                      id: Element.uuid(),
                      func: 'tan',
                      children: [],
                    });
                    if (this._position == 0)
                      this.parent?.insertChildBefore(v, this);
                    else this.parent?.insertChildAfter(v, this);
                    v.focus(-1);
                    break;
                  default:
                    break;
                }
              },
              () => {}
            );

            e.preventDefault();
            break;
          } else if (e.data == '^') {
            let v = new Power({
              id: Element.uuid(),
              children: [],
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '/') {
            let v = new Fraction({
              id: Element.uuid(),
              numerator: new SubFraction({
                id: Element.uuid(),
                children: [],
                isNumerator: true,
              }),
              denominator: new SubFraction({
                id: Element.uuid(),
                children: [],
                isNumerator: false,
              }),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '=') {
            let v = new Equals({
              id: Element.uuid(),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '-') {
            let v = new Minus({
              id: Element.uuid(),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '+') {
            let v = new Plus({
              id: Element.uuid(),
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data.toLowerCase() != e.data.toUpperCase()) {
            let v = new Variable({
              id: Element.uuid(),
              var: e.data,
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (
            e.data in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']
          ) {
            if (this._position == 0 && this.previousSibling instanceof Number) {
              this.previousSibling.text += e.data;
              this.previousSibling.focus(-1);
            } else if (
              this._position == 1 &&
              this.nextSibling instanceof Number
            ) {
              this.nextSibling.text = e.data + this.nextSibling.text;
              this.nextSibling.focus(1);
            } else {
              let v = new Number({
                id: Element.uuid(),
                num: parseFloat(e.data),
              });
              if (this._position == 0) this.parent?.insertChildBefore(v, this);
              else this.parent?.insertChildAfter(v, this);
              v.focus(-1);
            }
            e.preventDefault();
          }
        }
        // console.log(e.inputType, '   After', '  Handled.');
        break;
      case 'insertParagraph':
        e.preventDefault();
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
        // console.log(e.inputType, 'Before', '  Canceled.');
        break;
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (
          e.getTargetRanges()[0].startOffset == e.getTargetRanges()[0].endOffset
        ) {
          e.preventDefault();
          if (e.inputType == 'deleteContentBackward') {
            this.previousSibling?.delete(-1);
          } else {
            this.nextSibling?.delete(1);
          }
          // console.log(e.inputType, 'Before', '  Handled.');
        }
        break;
      default:
      // console.log(e.inputType, 'Before', '  Unhandled.');
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    if (e.target != this.dom) return;
    // console.log(e.inputType, '   After', 'Fired:', e);
    switch (e.inputType) {
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
          )
            this.focusAfter();
          else this.focusBefore();

          // console.log(e.inputType, '   After', '  Handled.');
          break;
        }
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
        e.preventDefault();
        break;
      default:
        // console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }
}

/**
 * @typedef NumberOptions
 * @prop {number} num
 */

/**
 * @typedef NumberSerialised
 * @prop {number} num
 */

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a number in a LaTeX maths environment.
 */
export class Number extends Element {
  static type = 'Number';

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @type {ElementSerialised & NumberSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      num: this.num,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @param {ElementOptions & NumberOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.num) throw new MathsError('A number must be provided.');
    this._num = options.num;
    this._text = options.num.toString();
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
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = this.text;

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    this._dom.addEventListener('keydown', (e) => {
      this._position = window.getSelection()?.getRangeAt(0).startOffset;
      if (e.key == 'ArrowLeft') {
        if (this._position == 0) this.focusBefore();
      } else if (e.key == 'ArrowRight') {
        if (this._position == this._text.length) this.focusAfter();
      }
    });
    this._dom.addEventListener(
      'beforeinput',
      this.handleBeforeInput.bind(this)
    );
    this._dom.addEventListener('input', this.handleInput.bind(this));
    return this._dom;
  }

  /**
   * @private
   * @type {number | undefined}
   */
  _position;
  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleBeforeInput(e) {
    if (e.target != this.dom) return;
    // console.log(e.inputType, 'Before', 'Fired:', e);
    switch (e.inputType) {
      case 'insertText':
        if (e.data == '^') {
          let v = new Power({
            id: Element.uuid(),
            children: [],
          });
          if (this._position == 0) this.parent?.insertChildBefore(v, this);
          else this.parent?.insertChildAfter(v, this);
          v.focus(-1);
          e.preventDefault();
          break;
        } else if (e.data == '/') {
          let v = new Fraction({
            id: Element.uuid(),
            numerator: new SubFraction({
              id: Element.uuid(),
              children: [],
              isNumerator: true,
            }),
            denominator: new SubFraction({
              id: Element.uuid(),
              children: [],
              isNumerator: false,
            }),
          });
          if (this._position == 0) this.parent?.insertChildBefore(v, this);
          else this.parent?.insertChildAfter(v, this);
          v.focus(-1);
          e.preventDefault();
          break;
        } else if (e.data == '=') {
          let v = new Equals({
            id: Element.uuid(),
          });
          if (this._position == 0) this.parent?.insertChildBefore(v, this);
          else this.parent?.insertChildAfter(v, this);
          v.focus(-1);
          e.preventDefault();
          break;
        } else if (e.data == '-') {
          let v = new Minus({
            id: Element.uuid(),
          });
          if (this._position == 0) this.parent?.insertChildBefore(v, this);
          else this.parent?.insertChildAfter(v, this);
          v.focus(-1);
          e.preventDefault();
          break;
        } else if (e.data == '+') {
          let v = new Plus({
            id: Element.uuid(),
          });
          if (this._position == 0) this.parent?.insertChildBefore(v, this);
          else this.parent?.insertChildAfter(v, this);
          v.focus(-1);
          e.preventDefault();
          break;
        } else if (e.data) {
          if (e.data.toLowerCase() != e.data.toUpperCase()) {
            let v = new Variable({
              id: Element.uuid(),
              var: e.data,
            });
            if (this._position == 0) this.parent?.insertChildBefore(v, this);
            else this.parent?.insertChildAfter(v, this);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (
            !(e.data in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'])
          ) {
            e.preventDefault();
          }
        }
        // console.log(e.inputType, '   After', '  Handled.');
        break;
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
        // console.log(e.inputType, 'Before', '  Canceled.');
        break;
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (
          e.getTargetRanges()[0].startOffset == e.getTargetRanges()[0].endOffset
        ) {
          e.preventDefault();
          if (e.inputType == 'deleteContentBackward') {
            this.previousSibling?.delete();
          } else {
            this.nextSibling?.delete();
          }
          // console.log(e.inputType, 'Before', '  Handled.');
        }
        break;
      default:
      // console.log(e.inputType, 'Before', '  Unhandled.');
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    if (e.target != this.dom) return;
    // console.log(e.inputType, '   After', 'Fired:', e);
    switch (e.inputType) {
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
          )
            this.focusAfter();
          else this.focusBefore();

          // console.log(e.inputType, '   After', '  Handled.');
          break;
        }
        // don't need to update the dom
        this._num = parseFloat(this.dom.innerText);
        this._text = this.dom.innerText;
        break;
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
        e.preventDefault();
        break;
      case 'insertText':
        // don't need to update the dom
        this._num = parseFloat(this.dom.innerText);
        this._text = this.dom.innerText;
      default:
        // console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }

  /**
   * Deletes the element in the position specified.
   * @param {number=} position
   *
   * @example el.delete(); // whole
   * @example el.delete(0); // whole
   * @example el.delete(1); // first char
   * @example el.delete(2); // first 2 chars
   * @example el.delete(-2); // last 2 chars
   * @example el.delete(-1); // last char
   */
  delete(position) {
    if (position == null || position == 0) {
      if (this.article?.readonly)
        throw new ElementError('Article is readonly.');

      this.parent?.removeChild(this);
      return this.dispatchEvent(new ElementEvent('delete', this, {}));
    }
    if (Math.sign(position) == -1) {
      this.text = this.text.substring(0, position + this.text.length);
    } else {
      this.text = this.text.substring(position);
    }
  }

  /**
   * @author Joseph Abbey
   * @date 06/05/2023
   * @type {string}
   */
  _text;
  /**
   * @author Joseph Abbey
   * @date 06/05/2023
   * @type {string}
   */
  get text() {
    return this._text;
  }
  set text(s) {
    if (this.article?.readonly) throw new MathsError('Article is readonly.');
    if (s.length == 0) this.delete();

    this._num = parseFloat(s);
    this._text = s;

    this.updateDom();

    this.dispatchEvent(
      new MathsEvent('edit', this, {
        content: this.num,
      })
    );
  }

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @type {number}
   */
  _num;
  /**
   * @author Joseph Abbey
   * @date 06/05/2023
   * @type {number}
   */
  get num() {
    return this._num;
  }
  set num(s) {
    if (this.article?.readonly) throw new MathsError('Article is readonly.');

    this._num = s;
    this._text = s.toString();

    this.updateDom();

    this.dispatchEvent(
      new MathsEvent('edit', this, {
        content: this.num,
      })
    );
  }

  get tex() {
    return this.num.toString();
  }
}

Number.register();

/**
 * @typedef VariableOptions
 * @prop {string} var
 */

/**
 * @typedef VariableSerialised
 * @prop {string} var
 */

/**
 * @author Joseph Abbey
 * @date 02/02/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a variable in a LaTeX maths environment.
 */
export class Variable extends SingleCharEditableElement {
  static type = 'Variable';

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & VariableSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      var: this.var,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @param {ElementOptions & VariableOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.var) throw new MathsError('A variable name must be provided.');
    this._var = options.var;
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
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = this.var;

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @type {string}
   */
  _var;
  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @type {string}
   */
  get var() {
    return this._var;
  }
  set var(s) {
    if (this.article?.readonly) throw new MathsError('Article is readonly.');

    this.updateDom();
    if (this.var == '') this.delete();
    else
      this.dispatchEvent(
        new MathsEvent('edit', this, {
          content: s,
        })
      );
  }

  get tex() {
    switch (this.var) {
      case 'α':
        return '\\alpha';
      case 'β':
        return '\\beta';
      case 'γ':
        return '\\gamma';
      case 'δ':
        return '\\delta';
      case 'ε':
        return '\\epsilon';
      case 'ζ':
        return '\\zeta';
      case 'η':
        return '\\eta';
      case 'θ':
        return '\\theta';
      case 'ι':
        return '\\iota';
      case 'κ':
        return '\\kappa';
      case 'λ':
        return '\\lamda';
      case 'μ':
        return '\\mu';
      case 'ν':
        return '\\nu';
      case 'ξ':
        return '\\xi';
      case 'π':
        return '\\pi';
      case 'ρ':
        return '\\rho';
      case 'σ':
        return '\\sigma';
      case 'τ':
        return '\\tau';
      case 'υ':
        return '\\upsilon';
      case 'φ':
        return '\\phi';
      case 'χ':
        return '\\chi';
      case 'ψ':
        return '\\psi';
      case 'ω':
        return '\\omega';
      default:
        return this.var;
    }
  }
}

Variable.register();

/**
 * @author Joseph Abbey
 * @date 05/02/2023
 * @constructor
 * @extends {Variable}
 *
 * @description An element representing a vector in a LaTeX maths environment.
 */
export class Vector extends Variable {
  static type = 'Vector';

  updateDom() {
    super.updateDom();
    var style = document.createElement('style');
    style.innerHTML = `
    #${this.id}:before {
      content: '\u2192';
      position: absolute;
      font-size: .65em;
      transform: translate(-2.85em, -0.5em);
    }`;
    this._dom?.appendChild(style);
  }

  get tex() {
    return '\\vec{' + super.tex + '}';
  }
}

Vector.register();

/**
 * @typedef BracketsOptions
 * @prop {boolean?} [square]
 */

/**
 * @typedef BracketsSerialised
 * @prop {boolean?} [square]
 */

/**
 * @author Joseph Abbey
 * @date 02/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing brackets in a LaTeX maths environment.
 */
export class Brackets extends Element {
  static type = 'Brackets';

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & BracketsSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      square: this.square,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @param {ElementOptions & BracketsOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    this.square = options.square ?? false;
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
    this._dom.style.fontFamily = 'math';
    this._dom.append(
      document.createTextNode(this.square ? '[' : '('),
      ...this.cdom,
      document.createTextNode(this.square ? ']' : ')')
    );
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return (this.square ? '[' : '(') + this.ctex + (this.square ? ']' : ')');
  }
}

Brackets.register();

const functions = /** @type {const} */ (['sin', 'cos', 'tan']);

/**
 * @typedef FunctionOptions
 * @prop {typeof functions[number]} func
 */

/**
 * @typedef FunctionSerialised
 * @prop {typeof functions[number]} func
 */

/**
 * @author Joseph Abbey
 * @date 02/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a function in a LaTeX maths environment.
 */
export class Function extends Element {
  static type = 'Function';

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & FunctionSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      func: this.func,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @param {ElementOptions & FunctionOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.func)
      throw new MathsError('A function name must be provided.');
    this.func = options.func;

    this.addEventListener('removeChild', this.updateDom);
    this.addEventListener('spliceChildren', this.updateDom);
    // this.addEventListener(
    //   'removeChild',
    //   () => this.children.length == 0 && this.delete()
    // );
    // this.addEventListener(
    //   'spliceChildren',
    //   () => this.children.length == 0 && this.delete()
    // );
  }

  /** @type {HTMLSelectElement?} */
  _nameDom;
  /** @type {HTMLSpanElement?} */
  _innerDom;
  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    var s = document.createElement('style');
    s.innerHTML = `
      #${this.id} {
        font-family: math;
        margin-left: 0.2em;
      }

      #${this.id} > select {
        background-color: transparent;
        border: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        display: inline;
      }

      #${this.id} > select::ms-expand {
        display: none;
      }

      #${this.id} > .inner.empty::before {
        content: " ";
        border: 1px dashed #bd00008f;
        background-color: #bd000029;
        display: inline-block;
        width: .5em;
        height: .5em;
      }

      #${this.id} > .inner.empty:focus::before {
        border: 1px dashed #bd0000c4;
        background-color: #bd00004d;
      }`;
    this._dom.appendChild(s);
    if (!this._nameDom) {
      this._nameDom = document.createElement('select');
      for (let f of functions) {
        let s = document.createElement('option');
        s.innerText = f;
        s.value = f;
        this._nameDom.appendChild(s);
      }
      this._nameDom.addEventListener(
        'change',
        //@ts-expect-error
        () => (this._func = this._nameDom?.value)
      );
    }
    this._nameDom.value = this.func;
    if (!this._innerDom) {
      this._innerDom = document.createElement('span');
      this._innerDom.addEventListener(
        'beforeinput',
        this.handleBeforeInput.bind(this)
      );
      this._innerDom.addEventListener('input', this.handleInput.bind(this));
    }
    this._innerDom.className = 'inner';
    this._innerDom.append(...this.cdom);
    if (this.children.length == 0) {
      this._innerDom.classList.add('empty');
      if (!this.article?.readonly) {
        this._innerDom.contentEditable = 'true';
      } else {
        this._innerDom.contentEditable = 'false';
      }
    } else {
      this._innerDom.classList.remove('empty');
      this._innerDom.contentEditable = 'false';
    }
    this._dom.append(
      this._nameDom,
      document.createTextNode('['),
      this._innerDom,
      document.createTextNode(']')
    );
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    return this._dom;
  }
  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleBeforeInput(e) {
    if (e.target != this._innerDom) return;
    if (!this._innerDom) return;
    // console.log(e.inputType, 'Before', 'Fired:', e);
    switch (e.inputType) {
      case 'insertText':
        e.preventDefault();
        if (e.data) {
          if (e.data == '^') {
            let v = new Power({
              id: Element.uuid(),
              children: [],
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '/') {
            let v = new Fraction({
              id: Element.uuid(),
              numerator: new SubFraction({
                id: Element.uuid(),
                children: [],
                isNumerator: true,
              }),
              denominator: new SubFraction({
                id: Element.uuid(),
                children: [],
                isNumerator: false,
              }),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '=') {
            let v = new Equals({
              id: Element.uuid(),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '-') {
            let v = new Minus({
              id: Element.uuid(),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '+') {
            let v = new Plus({
              id: Element.uuid(),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data.toLowerCase() != e.data.toUpperCase()) {
            let v = new Variable({
              id: Element.uuid(),
              var: e.data,
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (
            e.data in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']
          ) {
            let v = new Number({
              id: Element.uuid(),
              num: parseFloat(e.data),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
          }
        }
        // console.log(e.inputType, '   After', '  Handled.');
        break;
      case 'insertParagraph':
        e.preventDefault();
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
        // console.log(e.inputType, 'Before', '  Canceled.');
        break;
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (
          e.getTargetRanges()[0].startOffset == e.getTargetRanges()[0].endOffset
        ) {
          e.preventDefault();
          if (e.inputType == 'deleteContentBackward') {
            this.previousSibling?.delete(-1);
          } else {
            this.nextSibling?.delete(1);
          }
          // console.log(e.inputType, 'Before', '  Handled.');
        }
        break;
      default:
      // console.log(e.inputType, 'Before', '  Unhandled.');
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    if (e.target != this._innerDom) return;
    if (!this._innerDom) return;
    // console.log(e.inputType, '   After', 'Fired:', e);
    switch (e.inputType) {
      case 'deleteWordBackward':
      case 'deleteWordForward':
      case 'deleteByCut':
      case 'deleteContent':
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (this._innerDom.innerText == '') {
          if (
            e.inputType == 'deleteContentForward' ||
            e.inputType == 'deleteWordForward'
          )
            this.focusAfter();
          else this.focusBefore();
          // console.log(e.inputType, '   After', '  Handled.');
          break;
        }
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
        e.preventDefault();
        break;
      default:
        // console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }

  /**
   * @type {typeof functions[number]}
   */
  _func;
  get func() {
    return this._func;
  }
  set func(s) {
    this._func = s;
    if (this._nameDom) this._nameDom.value = s;

    this.dispatchEvent(
      new MathsEvent('edit', this, {
        content: this.func,
      })
    );
  }

  get tex() {
    return '\\' + this.func + '[' + this.ctex + ']';
  }

  /**
   * Focuses the element in the position specified.
   * @param {number=} position
   *
   * @example el.focus(); // beginning
   * @example el.focus(1);
   * @example el.focus(-1); // end
   */
  focus(position = 0) {
    if (this.children.length == 0) return this.dom.focus();

    if (position == -1)
      return this.children[this.children.length - 1].focus(-1);

    this.children[0].focus(position);
  }
}

Function.register();

/**
 * @author Joseph Abbey
 * @date 02/02/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a comma in a LaTeX maths environment.
 */
export class Comma extends SingleCharEditableElement {
  static type = 'Comma';

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
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
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = ',';
    // can't use spaces due to text editing
    this._dom.style.marginInlineEnd = '0.25em';

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }

  get tex() {
    return ', ';
  }
}

Comma.register();

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a c-dot in a LaTeX maths environment.
 */
export class CDot extends SingleCharEditableElement {
  static type = 'CDot';

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
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
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = '●';
    // can't use spaces due to text editing
    this._dom.style.marginInline = '0.25em';

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }

  get tex() {
    return '\\cdot';
  }
}

CDot.register();

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a equals in a LaTeX maths environment.
 */
export class Equals extends SingleCharEditableElement {
  static type = 'Equals';

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
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
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = '=';
    // can't use spaces due to text editing
    this._dom.style.marginInline = '0.25em';

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }

  get tex() {
    return ' &= ';
  }
}

Equals.register();

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {Equals}
 *
 * @description An element representing a approx equals in a LaTeX maths environment.
 */
export class Approx extends Equals {
  static type = 'Approx';

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = '≈';
    // can't use spaces due to text editing
    this._dom.style.marginInline = '0.25em';

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }

  get tex() {
    return ' \\approx ';
  }
}

Approx.register();

/**
 * @author Joseph Abbey
 * @date 07/05/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a minus in a LaTeX maths environment.
 */
export class Minus extends SingleCharEditableElement {
  static type = 'Minus';

  /**
   * @author Joseph Abbey
   * @date 07/05/2023
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
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = '-';

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }

  get tex() {
    return ' - ';
  }
}

Minus.register();

/**
 * @author Joseph Abbey
 * @date 07/05/2023
 * @constructor
 * @extends {SingleCharEditableElement}
 *
 * @description An element representing a plus in a LaTeX maths environment.
 */
export class Plus extends SingleCharEditableElement {
  static type = 'Plus';

  /**
   * @author Joseph Abbey
   * @date 07/05/2023
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
    this._dom.style.fontFamily = 'math';
    this._dom.innerText = '+';

    if (!this.article?.readonly) {
      this._dom.contentEditable = 'true';
    } else {
      this._dom.contentEditable = 'false';
    }
  }

  get tex() {
    return ' + ';
  }
}

Plus.register();

/**
 * @typedef SubFractionOptions
 * @prop {boolean} isNumerator
 */

/**
 * @typedef SubFractionSerialised
 * @prop {boolean} isNumerator
 */

/**
 * @author Joseph Abbey
 * @date 11/05/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX numerator or denominator.
 */
export class SubFraction extends Element {
  static type = 'SubFraction';

  /**
   * @author Joseph Abbey
   * @date 12/05/2023
   * @type {ElementSerialised & SubFractionSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      isNumerator: this.isNumerator,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 11/05/2023
   * @param {ElementOptions & SubFractionOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
    this.isNumerator = options.isNumerator;
    this.addEventListener('removeChild', this.updateDom);
    this.addEventListener('spliceChildren', this.updateDom);
    // this.addEventListener(
    //   'removeChild',
    //   () => this.children.length == 0 && this.delete()
    // );
    // this.addEventListener(
    //   'spliceChildren',
    //   () => this.children.length == 0 && this.delete()
    // );
  }

  /**
   * @protected
   * @type {boolean}
   */
  isNumerator;

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id; //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.textIndent = '0';
    this._dom.style.marginInline = '0.25em';
    var s = document.createElement('style');
    s.innerHTML = `
      #${this.id}.empty::before {
        content: " ";
        border: 1px dashed #bd00008f;
        background-color: #bd000029;
        display: inline-block;
        width: 1em;
        height: 1em;
      }

      #${this.id}.empty:focus::before {
        border: 1px dashed #bd0000c4;
        background-color: #bd00004d;
      }`;
    this._dom.appendChild(s);
    if (this.children.length == 0) {
      this._dom.classList.add('empty');
      if (!this.article?.readonly) {
        this._dom.contentEditable = 'true';
      } else {
        this._dom.contentEditable = 'false';
      }
    } else {
      this._dom.classList.remove('empty');
      this._dom.contentEditable = 'false';
    }
    this._dom.append(...this.cdom);
  }
  createDom() {
    this._dom = document.createElement('div');
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
    if (e.target != this.dom) return;
    // console.log(e.inputType, 'Before', 'Fired:', e);
    switch (e.inputType) {
      case 'insertText':
        e.preventDefault();
        if (e.data) {
          if (e.data == '^') {
            let v = new Power({
              id: Element.uuid(),
              children: [],
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '/') {
            let v = new Fraction({
              id: Element.uuid(),
              numerator: new SubFraction({
                id: Element.uuid(),
                children: [],
                isNumerator: true,
              }),
              denominator: new SubFraction({
                id: Element.uuid(),
                children: [],
                isNumerator: false,
              }),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '=') {
            let v = new Equals({
              id: Element.uuid(),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '-') {
            let v = new Minus({
              id: Element.uuid(),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '+') {
            let v = new Plus({
              id: Element.uuid(),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data.toLowerCase() != e.data.toUpperCase()) {
            let v = new Variable({
              id: Element.uuid(),
              var: e.data,
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (
            e.data in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']
          ) {
            let v = new Number({
              id: Element.uuid(),
              num: parseFloat(e.data),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
          }
        }
        // console.log(e.inputType, '   After', '  Handled.');
        break;
      case 'insertParagraph':
        e.preventDefault();
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
        // console.log(e.inputType, 'Before', '  Canceled.');
        break;
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (
          e.getTargetRanges()[0].startOffset == e.getTargetRanges()[0].endOffset
        ) {
          e.preventDefault();
          if (e.inputType == 'deleteContentBackward') {
            this.previousSibling?.delete(-1);
          } else {
            this.nextSibling?.delete(1);
          }
          // console.log(e.inputType, 'Before', '  Handled.');
        }
        break;
      default:
      // console.log(e.inputType, 'Before', '  Unhandled.');
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    if (e.target != this.dom) return;
    // console.log(e.inputType, '   After', 'Fired:', e);
    switch (e.inputType) {
      case 'deleteWordBackward':
      case 'deleteWordForward':
      case 'deleteByCut':
      case 'deleteContent':
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (this.dom.innerText == '') {
          if (
            e.inputType == 'deleteContentForward' ||
            e.inputType == 'deleteWordForward'
          )
            this.focusAfter();
          else this.focusBefore();
          // console.log(e.inputType, '   After', '  Handled.');
          break;
        }
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
        e.preventDefault();
        break;
      default:
        // console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }

  get tex() {
    return `${this.ctex}`;
  }

  /**
   * Focuses the element in the position specified.
   * @param {number=} position
   *
   * @example el.focus(); // beginning
   * @example el.focus(1);
   * @example el.focus(-1); // end
   */
  focus(position = 0) {
    if (this.children.length == 0) return this.dom.focus();

    if (position == -1)
      return this.children[this.children.length - 1].focus(-1);

    this.children[0].focus(position);
  }
  focusBefore() {
    if (!this.isNumerator && this.parent instanceof Fraction)
      return this.parent.numerator.focus(-1);
    this.parent?.focusBefore();
  }
  focusAfter() {
    if (this.isNumerator && this.parent instanceof Fraction)
      return this.parent.denominator.focus();
    this.parent?.focusAfter();
  }
}

SubFraction.register();

/**
 * @typedef FractionOptions
 * @prop {SubFraction} numerator
 * @prop {SubFraction} denominator
 */

/**
 * @typedef FractionSerialised
 * @prop {ElementSerialised} numerator
 * @prop {ElementSerialised} denominator
 */

/**
 * @author Joseph Abbey
 * @date 11/05/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a fraction in a LaTeX maths environment.
 */
export class Fraction extends Element {
  static type = 'Fraction';

  /**
   * @author Joseph Abbey
   * @date 11/05/2023
   * @type {ElementSerialised & FractionSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      numerator: this.numerator.serialised,
      denominator: this.denominator.serialised,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 11/05/2023
   * @param {ElementSerialised & FractionSerialised} s
   * @returns {Fraction}
   *
   * @description This deserialises an element.
   *
   * @see {@link Fraction~serialised}
   */
  static deserialise(s) {
    // @ts-expect-error
    return super.deserialise({
      ...s,
      numerator: SubFraction.deserialise(s.numerator),
      denominator: SubFraction.deserialise(s.denominator),
    });
  }

  /**
   * @author Joseph Abbey
   * @date 02/02/2023
   * @param {ElementOptions & FractionOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    this.numerator = options.numerator;
    this.numerator.parent = this;
    this.denominator = options.denominator;
    this.denominator.parent = this;
  }

  /**
   * @author Joseph Abbey
   * @date 11/05/2023
   * @type {SubFraction}
   *
   * @description The numerator of the fraction.
   */
  numerator;

  /**
   * @author Joseph Abbey
   * @date 11/05/2023
   * @type {SubFraction}
   *
   * @description The denominator of the fraction.
   */
  denominator;

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    this._dom.style.display = 'inline-block';
    var hr = document.createElement('hr');
    hr.style.margin = 'auto';
    hr.style.marginInline = '4px';
    hr.style.border = '1px solid #5e5e5e';
    hr.style.paddingInline = '6px';
    hr.style.paddingBlock = '0';
    this._dom.append(this.numerator.dom, hr, this.denominator.dom);
  }
  createDom() {
    this._dom = document.createElement('span');
    this.updateDom();
    return this._dom;
  }

  get tex() {
    return `\\frac{${this.numerator.tex}}{${this.denominator.tex}}`;
  }

  /**
   * Focuses the element in the position specified.
   * @param {number=} position
   *
   * @example el.focus(); // beginning
   * @example el.focus(1);
   * @example el.focus(-1); // end
   */
  focus(position = 0) {
    if (position == -1) return this.denominator.focus(-1);
    this.numerator.focus(position);
  }
}

Fraction.register();

/**
 * @author Joseph Abbey
 * @date 12/02/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX power.
 */
export class Power extends Element {
  static type = 'Power';

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   * @param {ElementOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);
    this.addEventListener('removeChild', this.updateDom);
    this.addEventListener('spliceChildren', this.updateDom);
    // this.addEventListener(
    //   'removeChild',
    //   () => this.children.length == 0 && this.delete()
    // );
    // this.addEventListener(
    //   'spliceChildren',
    //   () => this.children.length == 0 && this.delete()
    // );
  }

  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id; //@ts-expect-error
    this._dom.dataset.type = this.constructor.type;
    var s = document.createElement('style');
    s.innerHTML = `
      #${this.id}.empty::before {
        content: " ";
        border: 1px dashed #bd00008f;
        background-color: #bd000029;
        display: inline-block;
        width: .5em;
        height: .5em;
      }

      #${this.id}.empty:focus::before {
        border: 1px dashed #bd0000c4;
        background-color: #bd00004d;
      }`;
    this._dom.appendChild(s);
    if (this.children.length == 0) {
      this._dom.classList.add('empty');
      if (!this.article?.readonly) {
        this._dom.contentEditable = 'true';
      } else {
        this._dom.contentEditable = 'false';
      }
    } else {
      this._dom.classList.remove('empty');
      this._dom.contentEditable = 'false';
    }
    this._dom.append(...this.cdom);
  }
  createDom() {
    this._dom = document.createElement('sup');
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
    if (e.target != this.dom) return;
    // console.log(e.inputType, 'Before', 'Fired:', e);
    switch (e.inputType) {
      case 'insertText':
        e.preventDefault();
        if (e.data) {
          if (e.data == '^') {
            let v = new Power({
              id: Element.uuid(),
              children: [],
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '/') {
            let v = new Fraction({
              id: Element.uuid(),
              numerator: new SubFraction({
                id: Element.uuid(),
                children: [],
                isNumerator: true,
              }),
              denominator: new SubFraction({
                id: Element.uuid(),
                children: [],
                isNumerator: false,
              }),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '=') {
            let v = new Equals({
              id: Element.uuid(),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '-') {
            let v = new Minus({
              id: Element.uuid(),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data == '+') {
            let v = new Plus({
              id: Element.uuid(),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (e.data.toLowerCase() != e.data.toUpperCase()) {
            let v = new Variable({
              id: Element.uuid(),
              var: e.data,
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
            break;
          } else if (
            e.data in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']
          ) {
            let v = new Number({
              id: Element.uuid(),
              num: parseFloat(e.data),
            });
            this.appendChild(v);
            v.focus(-1);
            e.preventDefault();
          }
        }
        // console.log(e.inputType, '   After', '  Handled.');
        break;
      case 'insertParagraph':
        e.preventDefault();
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
        // console.log(e.inputType, 'Before', '  Canceled.');
        break;
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (
          e.getTargetRanges()[0].startOffset == e.getTargetRanges()[0].endOffset
        ) {
          e.preventDefault();
          if (e.inputType == 'deleteContentBackward') {
            this.previousSibling?.delete(-1);
          } else {
            this.nextSibling?.delete(1);
          }
          // console.log(e.inputType, 'Before', '  Handled.');
        }
        break;
      default:
      // console.log(e.inputType, 'Before', '  Unhandled.');
    }
  }

  /**
   * @param {InputEvent} e
   * @returns {void}
   */
  handleInput(e) {
    if (e.target != this.dom) return;
    // console.log(e.inputType, '   After', 'Fired:', e);
    switch (e.inputType) {
      case 'deleteWordBackward':
      case 'deleteWordForward':
      case 'deleteByCut':
      case 'deleteContent':
      case 'deleteContentBackward':
      case 'deleteContentForward':
        if (this.dom.innerText == '') {
          if (
            e.inputType == 'deleteContentForward' ||
            e.inputType == 'deleteWordForward'
          )
            this.focusAfter();
          else this.focusBefore();
          // console.log(e.inputType, '   After', '  Handled.');
          break;
        }
      case 'formatBold':
      case 'formatItalic':
      case 'formatUnderline':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertTranspose':
      case 'insertCompositionText':
        e.preventDefault();
        break;
      default:
        // console.log(e.inputType, '   After', '  Unhandled.');
        break;
    }
  }

  get tex() {
    return `^{${this.ctex}}`;
  }

  /**
   * Focuses the element in the position specified.
   * @param {number=} position
   *
   * @example el.focus(); // beginning
   * @example el.focus(1);
   * @example el.focus(-1); // end
   */
  focus(position = 0) {
    if (this.children.length == 0) return this.dom.focus();

    if (position == -1)
      return this.children[this.children.length - 1].focus(-1);

    this.children[0].focus(position);
  }
}

Power.register();
