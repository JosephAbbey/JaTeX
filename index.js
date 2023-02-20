if (!localStorage.getItem('article.default')) {
  fetch('./tmp/default.json')
    .then((r) => r.text())
    .then((t) => localStorage.setItem('article.default', t));
}

/** Create new article. */
function new_btn() {
  window.location.pathname = '/new.html';
}

/** Shows recent options. */
export function recent() {
  window.location.pathname = '/recent.html';
}

/**
 * Opens the article.
 * @param {string} id
 */
export function open(id) {
  window.location.href = '/?article=' + id;
}

/**
 * @returns All the keys of the articles stored in localStorage.
 */
export function getArticleIDs() {
  var ids = [];
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (k?.startsWith('article.')) ids.push(k.substring(8));
  }
  return ids;
}

/**
 * @param {string} id - The id of the command.
 * @param {(this: HTMLLIElement, ev: MouseEvent) => any} click - The function to call when the command is executed.
 * @param {string} text - The text of the command.
 * @param {(() => string) | string?} icon - the code for the icon to use for the command.
 * @returns {HTMLLIElement} The command element.
 * @description It creates a command element, sets its id, text, and icon, and then appends it to the navbar.
 */
export function addCommand(id, click, text, icon) {
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
  } else if (typeof icon === 'string') {
    li.style.setProperty('--cmd-palette-icon', "'\\" + icon + "'");
  }
  document.querySelector('#command_palette > div > ul')?.append(li);
  li.addEventListener('click', click, false);
  return li;
}

/**
 * @param {string} id - The id of the button.
 * @param {(this: HTMLButtonElement, ev: MouseEvent) => any} click - The function to call when the button is clicked.
 * @param {string?} ariaLabel - The text that will be read by screen readers.
 * @param {string} title - The text that appears when you hover over the button.
 * @param {string} icon - the icon to use for the button.
 * @returns {HTMLButtonElement} The button element.
 * @description It creates a button element, sets its id, aria-label, title, and icon, and then appends it to the navbar.
 */
export function addButton(id, click, ariaLabel, title, icon) {
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
  return btn;
}

document.addEventListener('DOMContentLoaded', () => {
  addButton('new_btn', new_btn, 'New Article', 'New Article ctrl+n', 'add');
});

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
