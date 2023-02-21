/**
 * @module Article
 */

import Element, { ElementError, ElementEvent } from './Element.js';
import MakeTitle from './MakeTitle.js';
/**
 * @typedef {import("./Element.js").ElementOptions} ElementOptions
 * @typedef {import("./Element.js").ElementSerialised} ElementSerialised
 */

export class ArticleError extends ElementError {}

/**
 * @author Joseph Abbey
 * @date 13/02/2023
 * @constructor
 * @extends {ElementEvent<Article,"editTitle">}
 *
 * @description Used to trigger article element specific events.
 */
export class ArticleEvent extends ElementEvent {}

/**
 * @typedef {Object} Package
 * @prop {string} name
 * @prop {?object} [options]
 */

/**
 * @typedef {Object} ArticleOptions
 * @prop {Package[]=} [packages]
 * @prop {string} title
 * @prop {string} author
 * @prop {boolean=} spellcheck
 * @prop {boolean=} readonly
 * @prop {Date=} date
 */

/**
 * @typedef {Object} ArticleSerialised
 * @prop {Package[]} packages
 * @prop {string} title
 * @prop {string} author
 * @prop {boolean} spellcheck
 * @prop {boolean} readonly
 * @prop {ReturnType<Date['toJSON']>} date
 */

/**
 * @author Joseph Abbey
 * @date 29/01/2023
 * @constructor
 * @extends {Element}
 *
 * @description An element representing a LaTeX article.
 */
export default class Article extends Element {
  static type = 'Article';

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
      packages: this.packages,
      author: this.author,
      title: this.title,
      spellcheck: this.spellcheck,
      readonly: this.readonly,
      date: this.date.toJSON(),
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
      date: s.date ? new Date(s.date) : undefined,
    });
  }

  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @param {ElementOptions & ArticleOptions} options - A configuration object.
   */
  constructor(options) {
    super(options);

    this.packages = options.packages ?? [];

    if (!options.title) throw new ArticleError('A title must be provided.');
    this._title = options.title;

    if (!options.author) throw new ArticleError('An author must be provided.');
    this.author = options.author;

    this.date = options.date ?? new Date();

    this.spellcheck = options.spellcheck ?? false;
    this.readonly = options.readonly ?? false;

    this.maketitles = [];

    this.article = this;
  }

  /**
   * @author Joseph Abbey
   * @date 13/02/2023
   * @type {MakeTitle[]}
   *
   * @description The maketitle elements in the article.
   */
  maketitles;

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
   * @date 29/01/2023
   * @type {string}
   *
   * @description The title of the article. `\title{%}`
   */
  get title() {
    return this._title;
  }
  set title(s) {
    if (this.article?.readonly) throw new ArticleError('Article is readonly.');

    this._title = s;
    // Update the dom.
    this.maketitles.forEach(
      (t) => t.dom.innerText != s && (t.dom.innerText = s)
    );

    this.dispatchEvent(
      new ArticleEvent('editTitle', this, {
        content: s,
      })
    );
  }

  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @type {string}
   *
   * @description The author of the article. `\author{%}`
   */
  author;

  /**
   * @author Joseph Abbey
   * @date 21/02/2023
   * @type {Date}
   *
   * @description The date this article was last edited. `\date{%}`
   */
  date;

  /**
   * @author Joseph Abbey
   * @date 20/02/2023
   * @type {boolean}
   *
   * @description Whether spellcheck is on.
   */
  spellcheck;

  /**
   * @author Joseph Abbey
   * @date 20/02/2023
   * @type {boolean}
   *
   * @description Whether readonly mode is on.
   */
  readonly;

  get tex() {
    return (
      '\\documentclass{article}\n' +
      this.packages
        .map(
          (p) =>
            `\\usepackage${
              p.options
                ? `[${Object.keys(p.options)
                    .map((k) => `${k}=${p.options[k]}`)
                    .join(',')}]`
                : ''
            }{${p.name}}\n`
        )
        .join('') +
      '\n' +
      `\\title{${this.title}}\n` +
      `\\author{${this.author}}\n` +
      `\\date{${this.date.toLocaleDateString()}}\n\n` +
      this.ctex
    );
  }

  /**
   * @author Joseph Abbey
   * @date 21/02/2023
   * @param {ArticleEvent} event - Data to emit with event.
   * @returns {void}
   *
   * @description Function to emit an event and update the edit date.
   */
  dispatchEvent(event) {
    this.date = new Date();
    super.dispatchEvent(event);
  }
}

Article.register();
