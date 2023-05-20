import Element, { ElementError, ElementEvent } from '../Element.js';
import {
  Equals,
  Fraction,
  MathsError,
  MathsEvent,
  Minus,
  Number,
  Plus,
  Power,
  SubFraction,
  Variable,
} from '../Maths.js';
/**
 * @typedef {import("../Element.js").ElementOptions} ElementOptions
 * @typedef {import("../Element.js").ElementSerialised} ElementSerialised
 */

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
export default class Function extends Element {
  static type = 'Function';
  static classes = super.classes + ' ' + this.type;

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
    //@ts-expect-error
    this._dom.className = this.constructor.classes;
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
        () => (
          //@ts-expect-error
          (this._func = this._nameDom?.value),
          this.dispatchEvent(
            new MathsEvent('edit', this, {
              content: this.func,
            })
          )
        )
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
