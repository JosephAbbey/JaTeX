import {
  addButton,
  addCommand,
  addCtrlKey,
  open,
  recent,
  reload,
  select_store,
  store,
  url,
} from './index.js';
import { Article, Element, ElementEvent, parse, AST } from './src/index.js';

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

/**
 * @param {String} key
 * @param {Article} article
 * @description Saves the article to local storage.
 */
function save(key, article) {
  store.set(key, article.serialised);
  if (document.title.startsWith('● ')) {
    document.querySelector('#save_btn')?.classList.remove('required');
    document.title = document.title.substring(2);
    window.removeEventListener('beforeunload', beforeunload);
  }
}

/**
 * @param {String} key
 * @param {Article} article
 * @description Shows the share sheet.
 */
async function share(key, article) {
  let url = await store.share(key);
  if (url == undefined) return;
  url = 'https://jatex.josephabbey.dev/?article=' + url;

  if (navigator.canShare({ url }))
    await navigator.share({
      title: article.title,
      text: 'View article on JaTeX.',
      url,
    });
  else alert(url);
}

/**
 * @param {String} key
 * @description Deletes the article in local storage.
 */
function reset(key) {
  store.delete(key);
  recent();
}

/**
 * @param {String} key
 * @param {Article} article
 * @description It opens a new window, with the LaTeX code of the article in.
 */
function showLaTeX(key, article) {
  /** @type {HTMLDialogElement?} */
  var dialog = document.createElement('dialog');
  if (dialog) {
    dialog.id = 'latex';
    dialog.innerHTML = '';
    var p = document.createElement('textarea');
    p.readOnly = article.readonly;
    var i = (p.value = article.tex);
    dialog.appendChild(p);
    dialog.addEventListener('close', (e) => {
      if (!article.readonly && i !== p.value) {
        store.set(key, AST.toAOM(parse(p.value)[1]).serialised);
        window.location.reload();
      }
      dialog?.remove();
    });
    document.body.appendChild(dialog);
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

/** */
export default async function sketch() {
  Element.map.clear();
  if (!url.searchParams.has('article')) return recent();
  const key = url.searchParams.get('article') ?? '';
  var s = await store.get(key);
  if (!s) return recent();
  var article = Article.deserialise(s);

  var root = document.createElement('div');
  root.id = 'root';
  root.appendChild(article.dom);
  var edit_controls = document.createElement('div');
  edit_controls.id = 'edit_controls';
  edit_controls.style.setProperty('display', article.readonly ? 'none' : '');
  var edit_controls_div = document.createElement('div');
  edit_controls.appendChild(edit_controls_div);
  var main = document.querySelector('main');
  if (main) {
    main.appendChild(root);
    main.appendChild(edit_controls);
  }

  document.title = article.title;

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
    // console.log(c);

    if (!document.title.startsWith('● ')) {
      document.querySelector('#save_btn')?.classList.add('required');
      document.title = '● ' + document.title;
      window.addEventListener('beforeunload', beforeunload);
    }
  });

  addButton('recent_btn', recent, 'Recent', 'Recent', 'update');
  const save_btn = addButton(
    'save_btn',
    () => save(key, article),
    'Save',
    'Save ctrl+s',
    'save'
  );
  save_btn.disabled = article.readonly;
  addButton('print_btn', () => print(), 'Print', 'Print ctrl+p', 'print');
  const share_btn = addButton(
    'share_btn',
    () => share(key, article),
    'Share',
    'Share ctrl+p',
    'share'
  );
  store.shareable(key).then((d) => (share_btn.disabled = !d));
  addButton(
    'show_latex_btn',
    () => showLaTeX(key, article),
    'Show LaTeX Code',
    'Show LaTeX Code ctrl+e',
    'code_blocks'
  );
  if (store.enabledStores().length != 1)
    addButton(
      'move_btn',
      async () => open(await store.move(key, await select_store())),
      'Move',
      'Move',
      'file_copy'
    );
  addButton('reset_btn', () => reset(key), 'Delete', 'Delete ctrl+d', 'delete');

  addEditControl(
    'bold_btn',
    () => document.execCommand('bold'),
    'Bold',
    'Bold',
    'format_bold'
  );
  addEditControl(
    'italic_btn',
    () => document.execCommand('italic'),
    'Italicise',
    'Italicise',
    'format_italic'
  );
  addEditControl(
    'underline_btn',
    () => document.execCommand('underline'),
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
    () => (article.spellcheck ? 'toggle_on' : 'toggle_off')
  );
  addCommand(
    'toggle_readonly',
    () => (
      (article.readonly = !article.readonly),
      Element.map.forEach((e) => e.update()),
      edit_controls.style.setProperty(
        'display',
        article.readonly ? 'none' : ''
      ),
      (save_btn.disabled = article.readonly)
    ),
    'Toggle readonly mode',
    () => (article.readonly ? 'toggle_on' : 'toggle_off')
  );

  addCtrlKey('s', () => save(key, article));
  addCtrlKey('e', () => showLaTeX(key, article));
  addCtrlKey('d', () => reset(key));

  const d = ({ data: { key: article } }) => article == key && recent();
  const e = ({ data: { key: article } }) => article == key && reload();

  store.addEventListener('delete', d);
  store.addEventListener('edit', e);

  return () => {
    store.removeEventListener('delete', d);
    store.removeEventListener('edit', e);
  };
}
