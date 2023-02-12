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
  Number,
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
        id: 'article__document',
        children: [
          new Section({
            id: 'article__document__pendulums',
            title: 'Pendulums',
            children: [
              new Paragraph({
                id: 'article__document__pendulums__0',
                children: [
                  new Text({
                    id: 'article__document__pendulums__0__0',
                    text: 'A pendulum is a mass connected at the end of an arm of constant length which is allowed to pivot about a fixed point. We shall find that they produce oscillatory or almost oscillatory behaviour depending on whether or not air resistance is taken into account.',
                  }),
                ],
              }),
              new Paragraph({
                id: 'article__document__pendulums__1',
                children: [
                  new Text({
                    id: 'article__document__pendulums__1__0',
                    text: 'We shall first define a cartesian coordinate system with the aforementioned fixed point at the origin. We will define ',
                  }),
                  new InlineMaths({
                    id: 'article__document__pendulums__1__1',
                    children: [
                      new Variable({
                        id: 'article__document__pendulums__1__1__0',
                        var: 'r',
                      }),
                    ],
                  }),
                  new Text({
                    id: 'article__document__pendulums__1__2',
                    text: " to be the length of the pendulum's arm and ",
                  }),
                  new InlineMaths({
                    id: 'article__document__pendulums__1__3',
                    children: [
                      new Variable({
                        id: 'article__document__pendulums__1__3__0',
                        var: 'θ',
                      }),
                      new Brackets({
                        id: 'article__document__pendulums__1__3__1',
                        children: [
                          new Variable({
                            id: 'article__document__pendulums__1__3__1_0',
                            var: 't',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new Text({
                    id: 'article__document__pendulums__1__4',
                    text: ' to be the angle counterclockwise from the y-axis of our coordinate plane to the arm of the pendulum at any time ',
                  }),
                  new InlineMaths({
                    id: 'article__document__pendulums__1__5',
                    children: [
                      new Variable({
                        id: 'article__document__pendulums__1__5__0',
                        var: 't',
                      }),
                    ],
                  }),
                  new Text({
                    id: 'article__document__pendulums__1__6',
                    text: '.',
                  }),
                ],
              }),
              new Paragraph({
                id: 'article__document__pendulums__2',
                children: [
                  new Text({
                    id: 'article__document__pendulums__2__0',
                    text: 'We can now define the position of the mass at any time ',
                  }),
                  new InlineMaths({
                    id: 'article__document__pendulums__2__1',
                    children: [
                      new Variable({
                        id: 'article__document__pendulums__2__1__0',
                        var: 't',
                      }),
                    ],
                  }),
                  new Text({
                    id: 'article__document__pendulums__2__2',
                    text: ' by using the constant distance from the origin and the angle function ',
                  }),
                  new InlineMaths({
                    id: 'article__document__pendulums__2__3',
                    children: [
                      new Variable({
                        id: 'article__document__pendulums__2__3__0',
                        var: 'θ',
                      }),
                      new Brackets({
                        id: 'article__document__pendulums__2__3__1',
                        children: [
                          new Variable({
                            id: 'article__document__pendulums__2__3__1__0',
                            var: 't',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new Text({
                    id: 'article__document__pendulums__2__4',
                    text: ' to construct a right angle triangle. Using the sine and cosine functions we find that the position of the mass at time ',
                  }),
                  new InlineMaths({
                    id: 'article__document__pendulums__2__5',
                    children: [
                      new Variable({
                        id: 'article__document__pendulums__2__5__0',
                        var: 't',
                      }),
                    ],
                  }),
                  new Text({
                    id: 'article__document__pendulums__2__6',
                    text: ' is ',
                  }),
                  new InlineMaths({
                    id: 'article__document__pendulums__2__7',
                    children: [
                      new Brackets({
                        id: 'article__document__pendulums__2__7__0',
                        children: [
                          new Variable({
                            id: 'article__document__pendulums__2__7__0__0',
                            var: 'r',
                          }),
                          new Function({
                            id: 'article__document__pendulums__2__7__0__1',
                            func: 'sin',
                            children: [
                              new Variable({
                                id: 'article__document__pendulums__2__7__0__1__0',
                                var: 'θ',
                              }),
                              new Brackets({
                                id: 'article__document__pendulums__2__7__0__1__1',
                                children: [
                                  new Variable({
                                    id: 'article__document__pendulums__2__7__0__1__1__0',
                                    var: 't',
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new Comma({
                            id: 'article__document__pendulums__2__7__0__2',
                          }),
                          new UnaryMinus({
                            id: 'article__document__pendulums__2__7__0__3',
                            children: [
                              new Variable({
                                id: 'article__document__pendulums__2__7__0__3__0',
                                var: 'r',
                              }),
                              new Function({
                                id: 'article__document__pendulums__2__7__0__3__1',
                                func: 'cos',
                                children: [
                                  new Variable({
                                    id: 'article__document__pendulums__2__7__0__3__1__0',
                                    var: 'θ',
                                  }),
                                  new Brackets({
                                    id: 'article__document__pendulums__2__7__0__3__1__1',
                                    children: [
                                      new Variable({
                                        id: 'article__document__pendulums__2__7__0__3__1__1__0',
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
                    id: 'article__document__pendulums__2__8',
                    text: '.',
                  }),
                ],
              }),
              new Paragraph({
                id: 'article__document__pendulums__3',
                children: [
                  new Text({
                    id: 'article__document__pendulums__3__0',
                    text: 'We now analyse the forces at work on the mass of the pendulum at any time ',
                  }),
                  new InlineMaths({
                    id: 'article__document__pendulums__3__1',
                    children: [
                      new Variable({
                        id: 'article__document__pendulums__3__1__0',
                        var: 't',
                      }),
                    ],
                  }),
                  new Text({
                    id: 'article__document__pendulums__3__2',
                    text: '. This is where our work diverges into two separate cases depending on whether or not we deem the contributions of air resistance to be negligible. We shall start with the far simpler case assuming that it does not have a noticeable impact before investigating what difficulties arise from including contributions of air resistance.',
                  }),
                ],
              }),
              new SubSection({
                id: 'article__document__pendulums__assuming_air_resistance_is_negligible',
                title: 'Assuming air resistance is negligible',
                children: [
                  new Paragraph({
                    id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0',
                    children: [
                      new Text({
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__0',
                        text: 'If we assume the contributions of air resistance to the resultant force on the mass to be negligible, we have only two forces acting on our mass: gravity and the centripetal force. Gravity acts downwards with a magnitude proportional to the mass ',
                      }),
                      new InlineMaths({
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__1',
                        children: [
                          new Variable({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__1__0',
                            var: 'm',
                          }),
                        ],
                      }),
                      new Text({
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__2',
                        text: ' where the constant of proportionality is ',
                      }),
                      new InlineMaths({
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__3',
                        children: [
                          new Variable({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__3__0',
                            var: 'g',
                          }),
                          new Approx({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__3__1',
                          }),
                          new Number({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__3__2',
                            num: 9.81,
                          }),
                          new Text({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__3__3',
                            text: 'ms',
                          }),
                          new Power({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__3__4',
                            children: [
                              new UnaryMinus({
                                id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__3__4__0',
                                children: [
                                  new Number({
                                    id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__3__4__0__0',
                                    num: 2,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      new Text({
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__4',
                        text: ". The centripetal force is the force keeping the mass attached to the pendulum's arm and it arises due to Newton's third law of motion (every action has an equal and opposite reaction). Therefore, we know it will be equal in magnitude but opposite in direction to the component of the force of gravity ",
                      }),
                      new InlineMaths({
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__5',
                        children: [
                          new Vector({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__5__0',
                            var: 'g',
                          }),
                        ],
                      }),
                      new Text({
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__6',
                        text: ' in the direction from the fixed pivot point to the mass. As we placed the origin at the fixed point, the vector from the fixed point to the mass is the position vector of the mass, ',
                      }),
                      new InlineMaths({
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__7',
                        children: [
                          new Variable({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__7__0__0',
                            var: 'r',
                          }),
                          new Brackets({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__7__0',
                            children: [
                              new Function({
                                id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__7__0__1',
                                func: 'sin',
                                children: [
                                  new Variable({
                                    id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__7__0__1__0',
                                    var: 'θ',
                                  }),
                                  new Brackets({
                                    id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__7__0__1__1',
                                    children: [
                                      new Variable({
                                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__7__0__1__1__0',
                                        var: 't',
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              new Comma({
                                id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__7__0__2',
                              }),
                              new UnaryMinus({
                                id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__7__0__3',
                                children: [
                                  new Function({
                                    id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__7__0__3__1',
                                    func: 'cos',
                                    children: [
                                      new Variable({
                                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__7__0__3__1__0',
                                        var: 'θ',
                                      }),
                                      new Brackets({
                                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__7__0__3__1__1',
                                        children: [
                                          new Variable({
                                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__7__0__3__1__1__0',
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
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__8',
                        text: '. The distance from the fixed point to the mass is defined to be ',
                      }),
                      new InlineMaths({
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__9',
                        children: [
                          new Variable({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__9__0',
                            var: 'r',
                          }),
                        ],
                      }),
                      new Text({
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__10',
                        text: ' and hence by dividing by this we find the unit vector ',
                      }),
                      new InlineMaths({
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11',
                        children: [
                          new Vector({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11__0',
                            var: 'd',
                          }),
                          new Equals({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11__1',
                          }),
                          new Brackets({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11__2',
                            square: true,
                            children: [
                              new Function({
                                id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11__2__1',
                                func: 'sin',
                                children: [
                                  new Variable({
                                    id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11__2__1__0',
                                    var: 'θ',
                                  }),
                                  new Brackets({
                                    id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11__2__1__1',
                                    children: [
                                      new Variable({
                                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11__2__1__1__0',
                                        var: 't',
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              new Comma({
                                id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11__2__2',
                              }),
                              new UnaryMinus({
                                id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11__2__3',
                                children: [
                                  new Function({
                                    id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11__2__3__1',
                                    func: 'cos',
                                    children: [
                                      new Variable({
                                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11__2__3__1__0',
                                        var: 'θ',
                                      }),
                                      new Brackets({
                                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11__2__3__1__1',
                                        children: [
                                          new Variable({
                                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__11__2__3__1__1__0',
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
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__12',
                        text: '. We therefore may find the centripetal force ',
                      }),
                      new InlineMaths({
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__13',
                        children: [
                          new Vector({
                            id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__13__0',
                            var: 'c',
                          }),
                        ],
                      }),
                      new Text({
                        id: 'article__document__pendulums__assuming_air_resistance_is_negligible__0__14',
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

article.addEventListener('childEvent', (e) => {
  /**
   * @var
   * @type {ElementEvent}
   */
  var c = e;
  while (c.type == 'childEvent') {
    c = c.data;
  }
  console.log(c, c.targetElement.serialised, article.serialised);

  if (!document.title.startsWith('● ')) {
    document.title = '● ' + document.title;
    window.addEventListener('beforeunload', beforeunload);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    localStorage.setItem('article', JSON.stringify(article.serialised));
    if (document.title.startsWith('● ')) {
      document.title = document.title.substring(2);
      window.removeEventListener('beforeunload', beforeunload);
    }
  }
});

//! remove
//@ts-expect-error
window.article = article;

console.log(article);
