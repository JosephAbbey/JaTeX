import { Bucket } from './Store.js';
import { Element } from './src/index.js';
export const store = new Bucket();

export const url = new URL(window.location.href);

/** Create new article. */
function new_btn() {
  var id = Element.uuid();
  // TODO: Allow for user selection
  store.set('LocalStorage:' + id, {
    class: 'Article',
    id,
    children: [
      {
        class: 'Document',
        id: Element.uuid(),
        children: [
          {
            class: 'PageNumbering',
            id: Element.uuid(),
            children: [],
            // @ts-ignore
            numbering: 'gobble',
          },
          { class: 'MakeTitle', id: Element.uuid(), children: [] },
          { class: 'NewPage', id: Element.uuid(), children: [] },
          {
            class: 'PageNumbering',
            id: Element.uuid(),
            children: [],
            // @ts-ignore
            numbering: 'arabic',
          },
        ],
      },
    ],
    packages: [],
    author: 'You',
    title: 'New Article',
    readonly: false,
    spellcheck: false,
    date: new Date().toJSON(),
  });
  open('LocalStorage:' + id);
}

const main = document.querySelector('main');

/** Shows recent options. */
export async function recent() {
  url.pathname = '/recent.html';
  url.searchParams.delete('article');
  window.history.pushState({}, '', url);
  document
    .querySelectorAll('link.page:not([disabled])')
    //@ts-expect-error
    .forEach((e) => (e.disabled = true));
  buttons.forEach((b) => b.remove());
  buttons = [];
  commands.forEach((c) => c.remove());
  commands = [];
  const style = document.querySelector('#style_recent');
  //@ts-expect-error
  if (style) style.disabled = false;
  else {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/recent.css';
    link.id = 'style_recent';
    link.classList.add('page');
    document.head.appendChild(link);
  }
  if (main) main.innerHTML = '';
  (await import('./recent.js')).default();
}

/**
 * Opens the article.
 * @param {string} id
 */
export async function open(id) {
  url.pathname = '/';
  url.searchParams.set('article', id);
  window.history.pushState({}, '', url);
  document
    .querySelectorAll('link.page:not([disabled])')
    //@ts-expect-error
    .forEach((e) => (e.disabled = true));
  buttons.forEach((b) => b.remove());
  buttons = [];
  commands.forEach((c) => c.remove());
  commands = [];
  const style = document.querySelector('#style_style');
  //@ts-expect-error
  if (style) style.disabled = false;
  else {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/style.css';
    link.id = 'style_style';
    link.classList.add('page');
    document.head.appendChild(link);
  }
  if (main) main.innerHTML = '';
  (await import('./sketch.js')).default();
}

/** @type {HTMLLIElement[]} */
var commands = [];

/**
 * @param {string} id - The id of the command.
 * @param {(this: HTMLLIElement, ev: MouseEvent) => any} click - The function to call when the command is executed.
 * @param {string} text - The text of the command.
 * @param {(() => string) | string?} icon - the code for the icon to use for the command.
 * @param {boolean=} permanent - If the button should not be removed when the page changes.
 * @returns {HTMLLIElement} The command element.
 * @description It creates a command element, sets its id, text, and icon, and then appends it to the navbar.
 */
export function addCommand(id, click, text, icon, permanent) {
  var li = document.createElement('li');
  li.id = id;
  li.innerText = text;
  if (icon instanceof Function) {
    li.style.setProperty('--cmd-palette-icon', "'\\" + icon() + "'");
    document
      .querySelector('#command')
      ?.addEventListener('mousedown', () =>
        li.style.setProperty('--cmd-palette-icon', "'\\" + icon() + "'")
      );
    li.addEventListener('click', () =>
      setTimeout(
        () => li.style.setProperty('--cmd-palette-icon', "'\\" + icon() + "'"),
        10
      )
    );
  } else if (typeof icon === 'string') {
    li.style.setProperty('--cmd-palette-icon', "'\\" + icon + "'");
  }
  document.querySelector('#command_palette > div > ul')?.append(li);
  li.addEventListener('click', click, false);
  if (!permanent) commands.push(li);
  return li;
}

/** @type {HTMLButtonElement[]} */
var buttons = [];

/**
 * @param {string} id - The id of the button.
 * @param {(this: HTMLButtonElement, ev: MouseEvent) => any} click - The function to call when the button is clicked.
 * @param {string?} ariaLabel - The text that will be read by screen readers.
 * @param {string} title - The text that appears when you hover over the button.
 * @param {string} icon - The icon to use for the button.
 * @param {boolean=} permanent - If the button should not be removed when the page changes.
 * @returns {HTMLButtonElement} The button element.
 * @description It creates a button element, sets its id, aria-label, title, and icon, and then appends it to the navbar.
 */
export function addButton(
  id,
  click,
  ariaLabel,
  title,
  icon,
  permanent = false
) {
  var btn = document.createElement('button');
  btn.id = id;
  btn.ariaLabel = ariaLabel;
  btn.title = title;
  var icn = document.createElement('span');
  icn.className = 'material-symbols-outlined';
  icn.innerHTML = icon;
  btn.append(icn);
  document.querySelector('#buttons')?.append(btn);
  btn.addEventListener('click', click, false);
  if (!permanent) buttons.push(btn);
  return btn;
}

/**
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>} A promise that resolves after a certain amount of time.
 * @description Wait for an amount of time.
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {string} s - Text to show.
 * @param {number} t - Time to show for (ms).
 * @description It pops up a snackbar message.
 */
export async function alert(s, t = 5000) {
  const snackbar = document.querySelector('#snackbar');
  if (snackbar) {
    const div = document.createElement('div');
    div.innerText = s;
    snackbar.appendChild(div);
    await sleep(1);
    div.classList.add('show');
    await sleep(t);
    div.classList.remove('show');
    await sleep(250);
    div.remove();
  }
}

/**
 * @author Dziad Borowy
 * @see {@link https://stackoverflow.com/questions/9206013/javascript-list-js-implement-a-fuzzy-search#answer-15252131}
 * @param {string} hay - The string to search in.
 * @param {string} needle - The string to search for.
 * @returns {boolean}
 * @description Fuzzy searches in the string and returns whether there is a match.
 */
export function fuzzy(hay, needle) {
  var hay = hay.toLowerCase();
  var n = -1;
  needle = needle.toLowerCase();
  for (var l of needle) if (!~(n = hay.indexOf(l, n + 1))) return false;
  return true;
}

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        new URL('/sw.js', import.meta.url),
        {
          scope: '/',
          type: 'module',
        }
      );
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

store.has('LocalStorage:default').then((d) =>
  d
    ? undefined
    : fetch('./tmp/default.json')
        .then((r) => r.json())
        .then((t) => store.set('LocalStorage:default', t))
);

addButton('new_btn', new_btn, 'New Article', 'New Article ctrl+n', 'add', true);

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey) {
    switch (e.key) {
      case 'n':
        e.preventDefault();
        new_btn();
        break;
      default:
    }
  } else {
    if (e.key == 'F1') {
      e.preventDefault();
      //@ts-expect-error
      document.querySelector('#command_input')?.focus();
    }
  }
});

document.querySelector('#command_input')?.addEventListener('input', (e) => {
  document.querySelectorAll('#command_palette > div > ul > li').forEach(
    (el) =>
      //@ts-expect-error
      (el.style.display = fuzzy(el.innerHTML, e.target?.value ?? '')
        ? 'list-item'
        : 'none')
  );
});
document
  .querySelector('#command_input')
  //@ts-expect-error
  ?.addEventListener('keypress', ({ key }) => {
    if (key === 'Enter') {
      document
        .querySelector(
          '#command_palette > div > ul > li:not([style*="display: none"])'
        )
        //@ts-expect-error
        ?.click();
    }
  });

registerServiceWorker();

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();

  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  // Update UI to notify the user they can add to home screen
  addButton(
    'install_btn',
    // @ts-ignore
    function (e) {
      // Hide our user interface that shows our A2HS button
      this.style.display = 'none';

      // Show the prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then(
        (/** @type {{ outcome: string; }} */ choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        }
      );
    },
    'Install',
    'Install',
    'install_desktop'
  );
});
