import { addButton, addCommand, recent } from './index.js';
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

/**
 * @param {string} id - The id of the button.
 * @param {(this: HTMLButtonElement, ev: MouseEvent) => any} click - The function to call when the button is clicked.
 * @param {string?} ariaLabel - The text that will be read by screen readers.
 * @param {string} title - The text that appears when you hover over the button.
 * @param {string} icon - the icon to use for the button.
 * @returns {HTMLButtonElement} The button element.
 * @description It creates a button element, sets its id, aria-label, title, and icon, and then appends it to the edit controls.
 */
function addEditControl(id, click, ariaLabel, title, icon) {
  var btn = document.createElement('button');
  btn.id = id;
  btn.ariaLabel = ariaLabel;
  btn.title = title;
  var icn = document.createElement('span');
  icn.className = 'material-symbols-outlined';
  icn.innerHTML = icon;
  btn.append(icn);
  document.querySelector('#edit_controls > div')?.append(btn);
  btn.addEventListener('click', click, false);
  return btn;
}

document.addEventListener('DOMContentLoaded', () => {
  addButton('recent_btn', recent, 'Recent', 'Recent', 'update');
  const save_btn = addButton('save_btn', save, 'Save', 'Save ctrl+s', 'save');
  addButton('print_btn', () => print(), 'Print', 'Print ctrl+p', 'print');
  addButton(
    'show_latex_btn',
    showLaTeX,
    'Show LaTeX Code',
    'Show LaTeX Code ctrl+e',
    'code_blocks'
  );
  addButton('reset_btn', reset, 'Delete', 'Delete ctrl+d', 'delete');

  addEditControl('bold_btn', bold, 'Bold', 'Bold', 'format_bold');
  addEditControl(
    'italic_btn',
    italic,
    'Italicise',
    'Italicise',
    'format_italic'
  );
  addEditControl(
    'underline_btn',
    underline,
    'Underline',
    'Underline',
    'format_underlined'
  );

  addCommand(
    'toggle_spellcheck',
    () => (
      // You may need to enable spell check in chrome://settings/languages
      (article.spellcheck = !article.spellcheck),
      Element.map.forEach((e) => e.update())
    ),
    'Toggle spell check',
    () => (article.spellcheck ? 'e9f6' : 'e9f5')
  );
  document
    .querySelector('#edit_controls')
    //@ts-expect-error
    ?.style.setProperty('display', article.readonly ? 'none' : '');
  save_btn.disabled = article.readonly;
  addCommand(
    'toggle_readonly',
    () => (
      (article.readonly = !article.readonly),
      Element.map.forEach((e) => e.update()),
      document
        .querySelector('#edit_controls')
        //@ts-expect-error
        ?.style.setProperty('display', article.readonly ? 'none' : ''),
      (save_btn.disabled = article.readonly)
    ),
    'Toggle readonly mode',
    () => (article.readonly ? 'e9f6' : 'e9f5')
  );
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
