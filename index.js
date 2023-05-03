import { Bucket } from './Store.js';
import { Element } from './src/index.js';
export const store = new Bucket(
  JSON.parse(localStorage.getItem('stores') || 'null') || {
    LocalStorage: true,
  }
);

if (localStorage.getItem('style'))
  applyStyle(JSON.parse(localStorage.getItem('styles') ?? ''));

/**
 * @param {{ [x: string]: string; }} style
 */
export function applyStyle(style) {
  const root = document.querySelector('html');
  for (let prop in style) root?.style.setProperty('--' + prop, style[prop]);
}

/**
 * @param {{ [x: string]: string; }} style
 */
export function setStyle(style) {
  localStorage.setItem('styles', JSON.stringify(style));
  applyStyle(style);
}

// store.addEventListener('create', console.log);
// store.addEventListener('delete', console.log);
// store.addEventListener('edit', console.log);

/**
 * @description It opens a dialog, with toggles for stores.
 */
function editBucket() {
  /** @type {HTMLDialogElement?} */
  var dialog = document.createElement('dialog');
  if (dialog) {
    dialog.id = 'bucket';
    dialog.innerHTML = '';

    const span = document.createElement('span');
    span.innerText = 'Stores:';
    dialog.appendChild(span);

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.marginTop = '0.5em';
    /** @type {[string, HTMLInputElement][]} */
    let toggles = Object.keys(Bucket.stores).map((s) => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.justifyContent = 'space-between';
      const label = document.createElement('label');
      label.htmlFor = 'bucket.' + s;
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.padding = '0.25em';
      label.style.height = 'calc(24px + 0.5em)';
      const icn = document.createElement('span');
      icn.className = 'material-symbols-outlined';
      icn.style.marginRight = '0.25em';
      icn.innerHTML = Bucket.stores[s].icon;
      label.append(icn);
      const text = document.createElement('span');
      text.innerText = s;
      label.appendChild(text);
      div.appendChild(label);
      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.id = 'bucket.' + s;
      //@ts-expect-error
      toggle.checked = store.enabled(s);
      div.appendChild(toggle);
      container?.appendChild(div);
      return [s, toggle];
    });
    dialog.appendChild(container);
    dialog.addEventListener('close', (e) => {
      localStorage.setItem(
        'stores',
        JSON.stringify(
          Object.fromEntries(
            toggles.map(
              ([s, t]) => (
                //@ts-expect-error
                t.checked != store.enabled(s) &&
                  //@ts-expect-error
                  (t.checked ? store.enable(s) : store.disable(s)),
                [s, t.checked]
              )
            )
          )
        )
      );
      reload();
      dialog?.remove();
    });
    document.body.appendChild(dialog);
    dialog.showModal();
  }
}

addCommand('bucket', editBucket, 'Edit sources', 'storage', true);

export var url = new URL(window.location.href);

/** Show a selection box for stores. */
export async function select_store() {
  return store.enabledStores().length == 1
    ? store.enabledStores()[0]
    : select(
        'Select a store',
        store.enabledStores().map((s) => [s, s, Bucket.stores[s].icon])
      );
}

/** Create new article. */
async function new_btn() {
  var id = Element.uuid();
  const s = await select_store();
  store.set(s + ':' + id, {
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
  open(s + ':' + id);
}

const main = document.querySelector('main');

let unmount = () => {};
/** Cleans the page for partial replacement. */
export function clean() {
  unmount();
  buttons.forEach((b) => b.remove());
  buttons = [];
  commands.forEach((c) => c.remove());
  commands = [];
  ctrlKeys.forEach((c) => window.removeEventListener('keydown', c));
  ctrlKeys = [];
  if (main) main.innerHTML = '';
}

/** Reloads the content of the page. */
export async function reload() {
  clean();
  switch (url.pathname) {
    case '/':
    case '/index':
    case '/index.html':
      unmount = (await (await import('./sketch.js')).default()) ?? (() => {});
      break;
    case '/recent':
    case '/recent.html':
      unmount = (await (await import('./recent.js')).default()) ?? (() => {});
      break;
    default:
      window.location.reload();
  }
}

window.addEventListener('popstate', async () => {
  url = new URL(window.location.href);
  reload();
});

/** Shows recent options. */
export async function recent() {
  url.pathname = '/recent.html';
  url.searchParams.delete('article');
  window.history.pushState({}, '', url);
  clean();
  unmount = (await (await import('./recent.js')).default()) ?? (() => {});
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
  unmount = (await (await import('./sketch.js')).default()) ?? (() => {});
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

/**
 * @template {string} T
 * @param {string} message - The text to be displayed to the user.
 * @param {([T, string] | [T, string, string])[]} options - The options to be displayed to the user.
 * @returns {Promise<T, void>} - The text the user entered.
 * @description It creates a text input at the top of the screen.
 */
export function select(message, options) {
  return new Promise((resolve, reject) => {
    /** @type {HTMLDialogElement?} */
    var dialog = document.createElement('dialog');
    if (dialog) {
      dialog.id = 'select';
      dialog.innerText = message;
      dialog?.appendChild(document.createElement('br'));
      const buttons = document.createElement('div');
      buttons.style.display = 'flex';
      buttons.style.flexDirection = 'column';
      buttons.style.gap = '0.5em';
      buttons.style.marginTop = '0.5em';
      options.forEach((s) => {
        const button = document.createElement('button');
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.padding = '0.5em';
        button.style.height = 'calc(24px + 0.5em)';
        if (s.length == 3) {
          const icn = document.createElement('span');
          icn.className = 'material-symbols-outlined';
          icn.style.marginRight = '0.25em';
          icn.innerHTML = s[2];
          button.append(icn);
        }
        const text = document.createElement('span');
        text.innerText = s[1];
        button.appendChild(text);
        button.addEventListener('click', (e) => {
          dialog?.remove();
          resolve(s[0]);
        });
        buttons?.appendChild(button);
      });
      dialog.appendChild(buttons);
      dialog.addEventListener('close', (e) => {
        reject();
      });
      document.body.appendChild(dialog);
      dialog.showModal();
    }
  });
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
    li.style.setProperty('--cmd-palette-icon', "'" + icon() + "'");
    document
      .querySelector('#command')
      ?.addEventListener('mousedown', () =>
        li.style.setProperty('--cmd-palette-icon', "'" + icon() + "'")
      );
    li.addEventListener('click', () =>
      setTimeout(
        () => li.style.setProperty('--cmd-palette-icon', "'" + icon() + "'"),
        10
      )
    );
  } else if (typeof icon === 'string') {
    li.style.setProperty('--cmd-palette-icon', "'" + icon + "'");
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
        e.stopPropagation();
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
document.querySelector('#command_input')?.addEventListener('input', (e) => {
  document.querySelectorAll('#articles > a').forEach(
    (el) =>
      //@ts-expect-error
      (el.style.display =
        fuzzy(
          el.children[0].children[0].innerHTML,
          //@ts-expect-error
          e.target?.value ?? ''
        ) ||
        fuzzy(
          el.children[0].children[1].children[0].innerHTML,
          //@ts-expect-error
          e.target?.value ?? ''
        ) ||
        fuzzy(
          el.children[0].children[2].innerHTML,
          //@ts-expect-error
          e.target?.value ?? ''
        )
          ? 'list-item'
          : 'none')
  );
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
