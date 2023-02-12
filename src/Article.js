/**
 * @module Article
 */

import Element, { ElementError, ElementEvent } from './Element.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

export class ArticleError extends ElementError {}

export class ArticleEvent extends ElementEvent {}

/**
 * @typedef {Object} Package
 * @prop {string} name
 * @prop {?object} [options]
 */

/**
 * @typedef {Object} ArticleOptions
 * @prop {HTMLElement} root
 * @prop {?Package[]} [packages]
 * @prop {string} title
 * @prop {string} author
 */

/**
 * @typedef {Object} ArticleSerialised
 * @prop {string} root - selector for the element
 * @prop {Package[]} [packages]
 * @prop {string} title
 * @prop {string} author
 */

/**
 * @author Aniket Chauhan
 * @date 16/03/2021
 * @see https://dev.to/aniket_chauhan/generate-a-css-selector-path-of-a-dom-element-4aim
 *
 * @param {HTMLElement} context - The DOM element you want to generate a selector for.
 * @returns {string} A string of the path to the element.
 * @description It takes a DOM element as an argument, and returns a string that can be used to select that element.
 */
function getSelector(context) {
  let index = getSelectorIndex(context);

  let pathSelector = '';
  while (context.tagName) {
    pathSelector = context.localName + (pathSelector ? '>' + pathSelector : '');
    //@ts-expect-error
    context =
      context.parentNode ??
      (() => {
        throw new ArticleError(
          'Unable to serialise article due to invalid root element.'
        );
      })();
  }
  pathSelector = pathSelector + `:nth-of-type(${index})`;
  return pathSelector;
}

/**
 * @author Aniket Chauhan
 * @date 16/03/2021
 * @see https://dev.to/aniket_chauhan/generate-a-css-selector-path-of-a-dom-element-4aim
 * @private
 * @param {HTMLElement} node - The node to get the index for.
 * @returns {number} The index of the element in the DOM.
 *
 * @description It loops through all the previous siblings of the element and increments the index by 1 if the
 * previous sibling is of the same type as the element.
 */
function getSelectorIndex(node) {
  let i = 1;
  let tagName = node.tagName;

  while (node.previousSibling) {
    //@ts-expect-error
    node = node.previousSibling;
    if (
      node.nodeType === 1 &&
      tagName.toLowerCase() == node.tagName.toLowerCase()
    ) {
      i++;
    }
  }
  return i;
}

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX article.
 */
export default class Article extends Element {
  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised & ArticleSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      ...super.serialised,
      root: getSelector(this.root),
      packages: this.packages,
      author: this.author,
      title: this.title,
    };
  }

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @param {ElementSerialised & ArticleSerialised} s
   * @returns {Article}
   *
   * @description This deserialises an element.
   *
   * @see {@link Article~serialised}
   */
  static deserialise(s) {
    //@ts-expect-error
    return super.deserialise({
      ...s,
      root: document.querySelector(s.root),
    });
  }

  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @param {ElementOptions & ArticleOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    if (!options.root)
      throw new ArticleError('A root element must be provided.');
    this.root = options.root;

    this.packages = options.packages ?? [];

    if (!options.title) throw new ArticleError('A title must be provided.');
    this.title = options.title;

    if (!options.author) throw new ArticleError('An author must be provided.');
    this.author = options.author;

    this.root.appendChild(this.dom);
  }

  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @type {HTMLElement}
   *
   * @description The root html element that this element will be attached to.
   */
  root;

  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @type {Package[]}
   *
   * @description Array of packages to be included in the article. `\usepackage{%}`
   */
  packages;

  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @type {string}
   *
   * @description The title of the article. `\title{%}`
   */
  title;

  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @type {string}
   *
   * @description The author of the article. `\author{%}`
   */
  author;

  get tex() {
    return (
      '\\documentclass{article}\n' +
      this.packages
        .map(
          (p) =>
            `\\usepackage${
              p[1]
                ? `[${Object.keys(p[1])
                    .map((k) => `${k}=${p[1][k]}`)
                    .join(',')}]`
                : ''
            }{${p[0]}}\n`
        )
        .join('') +
      '\n' +
      `\\title{${this.title}}\n` +
      `\\author{${this.author}}\n` +
      '\\date{\\today}\n\n' +
      this.ctex
    );
  }
}

Article.register();
