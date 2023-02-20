import { recent } from './index.js';
import {
  Article,
  Element,
  ElementEvent,
  bold,
  italic,
  underline,
} from './src/index.js';

var urlParams = new Map(new URL(window.location.href).searchParams.entries());

if (
  !urlParams.has('article') ||
  localStorage.getItem('article.' + urlParams.get('article')) == null
)
  recent();

/** @type {Article} */
//@ts-expect-error
var article = Element.deserialiseMany([
  JSON.parse(
    localStorage.getItem('article.' + urlParams.get('article')) ?? '{}'
  ),
])[0];

document.title = article.title;

/***/
function beforeunload(e) {
  e = e || window.event;
  e.preventDefault();

  // For IE and Firefox prior to version 4
  if (e) {
    e.returnValue = 'Reload site?';
  }

  // For Safari
  return 'Reload site?';
}

article.addEventListener('editTitle', (event) => {
  document.title =
    (document.title.startsWith('● ') ? '● ' : '') + event.data.content;
});

article.addEventListener('childEvent', (event) => {
  /**
   * @var
   * @type {ElementEvent}
   */
  var c = event;
  while (c.type == 'childEvent') {
    c = c.data;
  }
  console.log(c);

  if (!document.title.startsWith('● ')) {
    document.querySelector('#save_btn')?.classList.add('required');
    document.title = '● ' + document.title;
    window.addEventListener('beforeunload', beforeunload);
  }
});

/**
 * @description Saves the article to local storage.
 */
function save() {
  localStorage.setItem(
    'article.' + urlParams.get('article'),
    JSON.stringify(article.serialised)
  );
  if (document.title.startsWith('● ')) {
    document.querySelector('#save_btn')?.classList.remove('required');
    document.title = document.title.substring(2);
    window.removeEventListener('beforeunload', beforeunload);
  }
}

/**
 * @description Deletes the article in local storage.
 */
function reset() {
  localStorage.removeItem('article.' + urlParams.get('article'));
  recent();
}

/**
 * @description It opens a new window, with the LaTeX code of the article in.
 */
function showLaTeX() {
  /** @type {HTMLDialogElement?} */
  var dialog = document.querySelector('#latex');
  if (dialog) {
    dialog.innerHTML = '';
    var p = document.createElement('div');
    p.innerText = article.tex;
    dialog.appendChild(p);
    dialog.showModal();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#save_btn')?.addEventListener('click', save);
  document
    .querySelector('#show_latex_btn')
    ?.addEventListener('click', showLaTeX);
  document.querySelector('#reset_btn')?.addEventListener('click', reset);
  document.querySelector('#print_btn')?.addEventListener('click', print);
  document.querySelector('#bold_btn')?.addEventListener('click', bold);
  document.querySelector('#italic_btn')?.addEventListener('click', italic);
  document
    .querySelector('#underline_btn')
    ?.addEventListener('click', underline);
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey) {
    switch (e.key) {
      case 's':
        e.preventDefault();
        save();
        break;
      case 'e':
        e.preventDefault();
        showLaTeX();
        break;
      case 'd':
        e.preventDefault();
        reset();
        break;
      default:
    }
  }
});

//! remove
//@ts-expect-error
window.article = article;

console.log(article);
