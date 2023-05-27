export { default as parse } from './AST.js';
export * as AST from './AST.js';
/**
 * @typedef {import("./Article.js").Package} Package
 * @typedef {import("./Article.js").ArticleOptions} ArticleOptions
 * @typedef {import("./Article.js").ArticleSerialised} ArticleSerialised
 */
export { default as Article, ArticleError, ArticleEvent } from './Article.js';
export {
  default as Document,
  DocumentError,
  DocumentEvent,
} from './Document.js';
/**
 * @typedef {import("./Element.js").ElementEventListener} ElementEventListener
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */
export {
  default as Element,
  ElementError,
  ElementEvent,
  ElementMap,
} from './Element.js';
/**
 * @typedef {import("./Font.js").FontOptions} FontOptions
 * @typedef {import("./Font.js").FontSerialised} FontSerialised
 */
export { default as Font, FontError, FontEvent } from './Font.js';
/**
 * @typedef {import("./PageNumbering.js").PageNumberingOptions} PageNumberingOptions
 * @typedef {import("./PageNumbering.js").PageNumberingSerialised} PageNumberingSerialised
 */
export {
  default as PageNumbering,
  PageNumberingError,
  PageNumberingEvent,
} from './PageNumbering.js';
export {
  default as MakeTitle,
  MakeTitleError,
  MakeTitleEvent,
} from './MakeTitle.js';
/**
 * @typedef {import("./Maths.js").BracketsOptions} BracketsOptions
 * @typedef {import("./Maths.js").BracketsSerialised} BracketsSerialised
 * @typedef {import("./Maths.js").FractionOptions} FractionOptions
 * @typedef {import("./Maths.js").FractionSerialised} FractionSerialised
 * @typedef {import("./Maths.js").FunctionOptions} FunctionOptions
 * @typedef {import("./Maths.js").FunctionSerialised} FunctionSerialised
 * @typedef {import("./Maths.js").MathsOptions} MathsOptions
 * @typedef {import("./Maths.js").MathsSerialised} MathsSerialised
 * @typedef {import("./Maths.js").NumberOptions} NumberOptions
 * @typedef {import("./Maths.js").NumberSerialised} NumberSerialised
 * @typedef {import("./Maths.js").VariableOptions} VariableOptions
 * @typedef {import("./Maths.js").VariableSerialised} VariableSerialised
 */
export {
  default as Maths,
  Brackets,
  Comma,
  Fraction,
  Function,
  InlineMaths,
  MathsError,
  MathsEvent,
  Minus,
  Variable,
  Vector,
  Approx,
  CDot,
  Equals,
  Number,
  Power,
} from './Maths.js';
export {
  default as Paragraph,
  ParagraphError,
  ParagraphEvent,
} from './Paragraph.js';
/**
 * @typedef {import("./Section.js").SectionOptions} SectionOptions
 * @typedef {import("./Section.js").SectionSerialised} SectionSerialised
 */
export {
  default as Section,
  SectionError,
  SectionEvent,
  SubSection,
} from './Section.js';
/**
 * @typedef {import("./Text.js").TextOptions} TextOptions
 * @typedef {import("./Text.js").TextSerialised} TextSerialised
 */
export { default as Text, TextError, TextEvent } from './Text.js';
export { default as TextNormal } from './TextNormal.js';
export { default as NewPage } from './NewPage.js';

/**
 * @template {string} T
 * @param {T[]} commands
 * @returns {Promise<T, void>} - The text the user entered.
 * @description It creates a text input at the top of the screen.
 */
export function backslash(commands) {
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
