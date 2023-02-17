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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#new_btn')?.addEventListener('click', () => {
    new_btn();
  });
  document.querySelector('#recent_btn')?.addEventListener('click', () => {
    recent();
  });
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
const install = document.querySelector('#install_btn');
if (install) {
  //@ts-expect-error
  install.style.display = 'none';

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen

    //@ts-expect-error
    install.style.display = 'inline-block';

    install.addEventListener('click', (e) => {
      // Hide our user interface that shows our A2HS button

      //@ts-expect-error
      install.style.display = 'none';
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
    });
  });
}
