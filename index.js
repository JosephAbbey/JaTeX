import { Bucket } from './Store.js';
import { Element } from './src/index.js';
export const store = new Bucket();

export var url = new URL(window.location.href);

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

window.addEventListener('popstate', async () => {
  url = new URL(window.location.href);
  clean();
  switch (url.pathname) {
    case '/':
    case '/index':
    case '/index.html':
      (await import('./sketch.js')).default();
      break;
    case '/recent':
    case '/recent.html':
      (await import('./recent.js')).default();
      break;
    default:
      window.location.reload();
  }
});

/** Cleans the page for partial replacement. */
export function clean() {
  buttons.forEach((b) => b.remove());
  buttons = [];
  commands.forEach((c) => c.remove());
  commands = [];
  ctrlKeys.forEach((c) => window.removeEventListener('keydown', c));
  ctrlKeys = [];
  if (main) main.innerHTML = '';
}

/** Shows recent options. */
export async function recent() {
  url.pathname = '/recent.html';
  url.searchParams.delete('article');
  window.history.pushState({}, '', url);
  clean();
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
  clean();
  (await import('./sketch.js')).default();
}

/**
 * @param {string} message - The text to be displayed to the user.
 * @returns {Promise<string, void>} - The text the user entered.
 * @description It creates a text input at the top of the screen.
 */
export function prompt(message) {
  const div = document.createElement('div');
  div.classList.add('prompt');
  const div_div = document.createElement('div');
  const div_div_input = document.createElement('input');
  div_div_input.autocomplete = 'off';
  div_div_input.spellcheck = false;
  div_div.appendChild(div_div_input);
  const div_div_div = document.createElement('div');
  const div_div_div_div = document.createElement('div');
  div_div_div_div.innerText = message;
  div_div_div.appendChild(div_div_div_div);
  div_div.appendChild(div_div_div);
  div.appendChild(div_div);
  document.body.appendChild(div);
  div_div_input.focus();
  return new Promise((resolve, reject) =>
    div_div_input.addEventListener('change', () => {
      div.remove();
      if (div_div_input.value == '') reject();
      else resolve(div_div_input.value);
    })
  );
}

addCommand(
  'prompt',
  () => prompt('Woo Hoo!').then(console.log),
  'Prompt',
  'e745',
  true
);

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

/** @type {((this: Window, ev: KeyboardEvent) => any)[]} */
var ctrlKeys = [];

/**
 * @param {string} key - The key to listen for.
 * @param {(this: Window, ev: KeyboardEvent) => any} press - The function to call when the key is pressed.
 * @param {boolean=} permanent - If the button should not be removed when the page changes.
 * @description It adds an eventlistener for `ctrl+${key}`.
 */
export function addCtrlKey(key, press, permanent = false) {
  /** @type {(this: Window, ev: KeyboardEvent) => any} */
  const handle = function (e) {
    if (e.ctrlKey) {
      if (e.key == key) {
        e.preventDefault();
        press.bind(this)(e);
      }
    }
  };
  window.addEventListener('keydown', handle);
  if (!permanent) ctrlKeys.push(handle);
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
 * @returns {Promise<boolean>} - Whether the user confirmed or canceled.
 * @description It pops up a snackbar message with confirm and cancel buttons.
 */
export async function confirm(s) {
  const snackbar = document.querySelector('#snackbar');
  if (snackbar) {
    const div = document.createElement('div');
    div.innerText = s;
    const div_div = document.createElement('div');
    const div_div_yes = document.createElement('button');
    div_div_yes.innerText = 'yes';
    div_div.appendChild(div_div_yes);
    const div_div_no = document.createElement('button');
    div_div_no.innerText = 'no';
    div_div.appendChild(div_div_no);
    div.appendChild(div_div);
    div.classList.add('confirm');
    snackbar.appendChild(div);
    div.classList.add('show');
    // Wait for button press
    /** @type {boolean} */
    var c = await new Promise((resolve) => {
      div_div_yes.addEventListener('click', () => resolve(true));
      div_div_no.addEventListener('click', () => resolve(false));
    });
    div.classList.remove('show');
    await sleep(250);
    div.remove();
    return c;
  }
  return false;
}

//@ts-expect-error
window.confirm = confirm;

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

addButton('new_btn', new_btn, 'New Article', 'New Article ctrl+n', 'add', true);

addCtrlKey('n', new_btn, true);

document.addEventListener('keydown', (e) => {
  if (e.key == 'F1') {
    e.preventDefault();
    //@ts-expect-error
    document.querySelector('#command_input')?.focus();
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

if (location.hostname !== 'localhost') {
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
}
