import {
  Approx,
  Article,
  Brackets,
  Comma,
  Document,
  Element,
  ElementEvent,
  Equals,
  Function,
  InlineMaths,
  MakeTitle,
  NewPage,
  Number,
  PageNumbering,
  Paragraph,
  Power,
  Section,
  SubSection,
  Text,
  UnaryMinus,
  Variable,
  Vector,
} from './src/index.js';

/**
 * @var
 * @type {Article}
 */
//@ts-expect-error
var article =
  Element.deserialiseMany([
    JSON.parse(localStorage.getItem('article') ?? 'null'),
  ])[0] ??
  new Article({
    root: document.querySelector('#root') ?? document.createElement('div'),
    id: 'article',
    title: 'Simple Oscillations',
    author: 'Benjamin Jones',
    packages: [
      { name: 'amsmath' },
      { name: 'amsthm' },
      { name: 'amssymb' },
      { name: 'booktabs' },
      { name: 'graphicx' },
      { name: 'array' },
      { name: 'geometry', options: { margin: '1.5in' } },
    ],
    children: [
      new Document({
        id: Element.uuid(),
        children: [
          new PageNumbering({
            id: Element.uuid(),
            numbering: 'gobble',
          }),
          new MakeTitle({
            id: Element.uuid(),
          }),
          new NewPage({
            id: Element.uuid(),
          }),
          new PageNumbering({
            id: Element.uuid(),
            numbering: 'arabic',
          }),
          new Section({
            id: Element.uuid(),
            title: 'Pendulums',
            children: [
              new Paragraph({
                id: Element.uuid(),
                children: [
                  new Text({
                    id: Element.uuid(),
                    text: 'A pendulum is a mass connected at the end of an arm of constant length which is allowed to pivot about a fixed point. We shall find that they produce oscillatory or almost oscillatory behaviour depending on whether or not air resistance is taken into account.',
                  }),
                ],
              }),
              new Paragraph({
                id: Element.uuid(),
                children: [
                  new Text({
                    id: Element.uuid(),
                    text: 'We shall first define a cartesian coordinate system with the aforementioned fixed point at the origin. We will define ',
                  }),
                  new InlineMaths({
                    id: Element.uuid(),
                    children: [
                      new Variable({
                        id: Element.uuid(),
                        var: 'r',
                      }),
                    ],
                  }),
                  new Text({
                    id: Element.uuid(),
                    text: " to be the length of the pendulum's arm and ",
                  }),
                  new InlineMaths({
                    id: Element.uuid(),
                    children: [
                      new Variable({
                        id: Element.uuid(),
                        var: 'θ',
                      }),
                      new Brackets({
                        id: Element.uuid(),
                        children: [
                          new Variable({
                            id: Element.uuid(),
                            var: 't',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new Text({
                    id: Element.uuid(),
                    text: ' to be the angle counterclockwise from the y-axis of our coordinate plane to the arm of the pendulum at any time ',
                  }),
                  new InlineMaths({
                    id: Element.uuid(),
                    children: [
                      new Variable({
                        id: Element.uuid(),
                        var: 't',
                      }),
                    ],
                  }),
                  new Text({
                    id: Element.uuid(),
                    text: '.',
                  }),
                ],
              }),
              new Paragraph({
                id: Element.uuid(),
                children: [
                  new Text({
                    id: Element.uuid(),
                    text: 'We can now define the position of the mass at any time ',
                  }),
                  new InlineMaths({
                    id: Element.uuid(),
                    children: [
                      new Variable({
                        id: Element.uuid(),
                        var: 't',
                      }),
                    ],
                  }),
                  new Text({
                    id: Element.uuid(),
                    text: ' by using the constant distance from the origin and the angle function ',
                  }),
                  new InlineMaths({
                    id: Element.uuid(),
                    children: [
                      new Variable({
                        id: Element.uuid(),
                        var: 'θ',
                      }),
                      new Brackets({
                        id: Element.uuid(),
                        children: [
                          new Variable({
                            id: Element.uuid(),
                            var: 't',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new Text({
                    id: Element.uuid(),
                    text: ' to construct a right angle triangle. Using the sine and cosine functions we find that the position of the mass at time ',
                  }),
                  new InlineMaths({
                    id: Element.uuid(),
                    children: [
                      new Variable({
                        id: Element.uuid(),
                        var: 't',
                      }),
                    ],
                  }),
                  new Text({
                    id: Element.uuid(),
                    text: ' is ',
                  }),
                  new InlineMaths({
                    id: Element.uuid(),
                    children: [
                      new Brackets({
                        id: Element.uuid(),
                        children: [
                          new Variable({
                            id: Element.uuid(),
                            var: 'r',
                          }),
                          new Function({
                            id: Element.uuid(),
                            func: 'sin',
                            children: [
                              new Variable({
                                id: Element.uuid(),
                                var: 'θ',
                              }),
                              new Brackets({
                                id: Element.uuid(),
                                children: [
                                  new Variable({
                                    id: Element.uuid(),
                                    var: 't',
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new Comma({
                            id: Element.uuid(),
                          }),
                          new UnaryMinus({
                            id: Element.uuid(),
                            children: [
                              new Variable({
                                id: Element.uuid(),
                                var: 'r',
                              }),
                              new Function({
                                id: Element.uuid(),
                                func: 'cos',
                                children: [
                                  new Variable({
                                    id: Element.uuid(),
                                    var: 'θ',
                                  }),
                                  new Brackets({
                                    id: Element.uuid(),
                                    children: [
                                      new Variable({
                                        id: Element.uuid(),
                                        var: 't',
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  new Text({
                    id: Element.uuid(),
                    text: '.',
                  }),
                ],
              }),
              new Paragraph({
                id: Element.uuid(),
                children: [
                  new Text({
                    id: Element.uuid(),
                    text: 'We now analyse the forces at work on the mass of the pendulum at any time ',
                  }),
                  new InlineMaths({
                    id: Element.uuid(),
                    children: [
                      new Variable({
                        id: Element.uuid(),
                        var: 't',
                      }),
                    ],
                  }),
                  new Text({
                    id: Element.uuid(),
                    text: '. This is where our work diverges into two separate cases depending on whether or not we deem the contributions of air resistance to be negligible. We shall start with the far simpler case assuming that it does not have a noticeable impact before investigating what difficulties arise from including contributions of air resistance.',
                  }),
                ],
              }),
              new SubSection({
                id: Element.uuid(),
                title: 'Assuming air resistance is negligible',
                children: [
                  new Paragraph({
                    id: Element.uuid(),
                    children: [
                      new Text({
                        id: Element.uuid(),
                        text: 'If we assume the contributions of air resistance to the resultant force on the mass to be negligible, we have only two forces acting on our mass: gravity and the centripetal force. Gravity acts downwards with a magnitude proportional to the mass ',
                      }),
                      new InlineMaths({
                        id: Element.uuid(),
                        children: [
                          new Variable({
                            id: Element.uuid(),
                            var: 'm',
                          }),
                        ],
                      }),
                      new Text({
                        id: Element.uuid(),
                        text: ' where the constant of proportionality is ',
                      }),
                      new InlineMaths({
                        id: Element.uuid(),
                        children: [
                          new Variable({
                            id: Element.uuid(),
                            var: 'g',
                          }),
                          new Approx({
                            id: Element.uuid(),
                          }),
                          new Number({
                            id: Element.uuid(),
                            num: 9.81,
                          }),
                          new Text({
                            id: Element.uuid(),
                            text: 'ms',
                          }),
                          new Power({
                            id: Element.uuid(),
                            children: [
                              new UnaryMinus({
                                id: Element.uuid(),
                                children: [
                                  new Number({
                                    id: Element.uuid(),
                                    num: 2,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      new Text({
                        id: Element.uuid(),
                        text: ". The centripetal force is the force keeping the mass attached to the pendulum's arm and it arises due to Newton's third law of motion (every action has an equal and opposite reaction). Therefore, we know it will be equal in magnitude but opposite in direction to the component of the force of gravity ",
                      }),
                      new InlineMaths({
                        id: Element.uuid(),
                        children: [
                          new Vector({
                            id: Element.uuid(),
                            var: 'g',
                          }),
                        ],
                      }),
                      new Text({
                        id: Element.uuid(),
                        text: ' in the direction from the fixed pivot point to the mass. As we placed the origin at the fixed point, the vector from the fixed point to the mass is the position vector of the mass, ',
                      }),
                      new InlineMaths({
                        id: Element.uuid(),
                        children: [
                          new Variable({
                            id: Element.uuid(),
                            var: 'r',
                          }),
                          new Brackets({
                            id: Element.uuid(),
                            children: [
                              new Function({
                                id: Element.uuid(),
                                func: 'sin',
                                children: [
                                  new Variable({
                                    id: Element.uuid(),
                                    var: 'θ',
                                  }),
                                  new Brackets({
                                    id: Element.uuid(),
                                    children: [
                                      new Variable({
                                        id: Element.uuid(),
                                        var: 't',
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              new Comma({
                                id: Element.uuid(),
                              }),
                              new UnaryMinus({
                                id: Element.uuid(),
                                children: [
                                  new Function({
                                    id: Element.uuid(),
                                    func: 'cos',
                                    children: [
                                      new Variable({
                                        id: Element.uuid(),
                                        var: 'θ',
                                      }),
                                      new Brackets({
                                        id: Element.uuid(),
                                        children: [
                                          new Variable({
                                            id: Element.uuid(),
                                            var: 't',
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      new Text({
                        id: Element.uuid(),
                        text: '. The distance from the fixed point to the mass is defined to be ',
                      }),
                      new InlineMaths({
                        id: Element.uuid(),
                        children: [
                          new Variable({
                            id: Element.uuid(),
                            var: 'r',
                          }),
                        ],
                      }),
                      new Text({
                        id: Element.uuid(),
                        text: ' and hence by dividing by this we find the unit vector ',
                      }),
                      new InlineMaths({
                        id: Element.uuid(),
                        children: [
                          new Vector({
                            id: Element.uuid(),
                            var: 'd',
                          }),
                          new Equals({
                            id: Element.uuid(),
                          }),
                          new Brackets({
                            id: Element.uuid(),
                            square: true,
                            children: [
                              new Function({
                                id: Element.uuid(),
                                func: 'sin',
                                children: [
                                  new Variable({
                                    id: Element.uuid(),
                                    var: 'θ',
                                  }),
                                  new Brackets({
                                    id: Element.uuid(),
                                    children: [
                                      new Variable({
                                        id: Element.uuid(),
                                        var: 't',
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              new Comma({
                                id: Element.uuid(),
                              }),
                              new UnaryMinus({
                                id: Element.uuid(),
                                children: [
                                  new Function({
                                    id: Element.uuid(),
                                    func: 'cos',
                                    children: [
                                      new Variable({
                                        id: Element.uuid(),
                                        var: 'θ',
                                      }),
                                      new Brackets({
                                        id: Element.uuid(),
                                        children: [
                                          new Variable({
                                            id: Element.uuid(),
                                            var: 't',
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      new Text({
                        id: Element.uuid(),
                        text: '. We therefore may find the centripetal force ',
                      }),
                      new InlineMaths({
                        id: Element.uuid(),
                        children: [
                          new Vector({
                            id: Element.uuid(),
                            var: 'c',
                          }),
                        ],
                      }),
                      new Text({
                        id: Element.uuid(),
                        text: ' via an application of the dot product as follows',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

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
  console.log(c, c.targetElement.serialised, article.serialised);

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
  localStorage.setItem('article', JSON.stringify(article.serialised));
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
  localStorage.removeItem('article');
  window.location.reload();
}

/**
 * @description It opens a new window, with the LaTeX code of the article in.
 */
function showLaTeX() {
  var w = window.open('about:blank', 'JaTeX', 'popup');
  var p = document.createElement('pre');
  p.innerText = article.tex;
  if (w) w.document.body.appendChild(p);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#save_btn')?.addEventListener('click', () => {
    save();
  });
  document.querySelector('#reset_btn')?.addEventListener('click', () => {
    reset();
  });
  document.querySelector('#print_btn')?.addEventListener('click', () => {
    print();
  });
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
    install.style.display = 'block';

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
