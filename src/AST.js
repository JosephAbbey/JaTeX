import Article from './Article.js';
import Element from './Element.js';
import PageNumbering from './PageNumbering.js';
import NewPage from './NewPage.js';
import MakeTitle from './MakeTitle.js';
import Section, { SubSection } from './Section.js';
import Document from './Document.js';
import TextElement from './Text.js';
import Paragraph from './Paragraph.js';
import {
  Equals,
  Power,
  InlineMaths as InlineMathsElement,
  Brackets as BracketsElement,
  Variable,
  Approx,
  Vector,
} from './Maths.js';
import TextNormal from './TextNormal.js';
/**
 * @typedef {import("./Article.js").Package} Package
 */

/**
 * @author Joseph Abbey
 * @date 21/02/2023
 * @constructor
 *
 * @description a Node in the AST.
 */
export class Node {}
export class Text extends Node {
  /**
   * @author Joseph Abbey
   * @date 21/02/2023
   * @param {string} text
   */
  constructor(text) {
    super();
    this.text = text;
  }

  /**
   * @type {string}
   */
  text;
}
export class Break extends Node {}
export class InlineMaths extends Node {
  /**
   * @author Joseph Abbey
   * @date 22/02/2023
   * @param {Node[]} children
   */
  constructor(children) {
    super();
    this.children = children;
  }

  /**
   * @type {Node[]}
   */
  children;
}
export class Brackets extends Node {
  /**
   * @author Joseph Abbey
   * @date 22/02/2023
   * @param {Node[]} children
   * @param {boolean=} square
   */
  constructor(children, square = false) {
    super();
    this.children = children;
    this.square = square;
  }

  /**
   * @type {boolean}
   */
  square;

  /**
   * @type {Node[]}
   */
  children;
}
export class Tag extends Node {
  /**
   * @author Joseph Abbey
   * @date 21/02/2023
   * @param {string} tag
   * @param {Node[]=} data
   * @param {{ [key: string]: string }=} keyValueData
   */
  constructor(tag, data, keyValueData) {
    super();
    this.tag = tag;
    this.data = data;
    this.keyValueData = keyValueData;
  }

  /**
   * @type {string}
   */
  tag;

  /**
   * @type {Node[]=}
   */
  data;

  /**
   * @type {{ [key: string]: string }=}
   */
  keyValueData;
}
export class Env extends Tag {
  /**
   * @author Joseph Abbey
   * @date 21/02/2023
   * @param {Node[]} children
   * @param {Node[]=} data
   * @param {{ [key: string]: string }=} keyValueData
   */
  constructor(children, data, keyValueData) {
    super('begin', data, keyValueData);
    this.children = children;
  }

  /**
   * @type {Node[]}
   */
  children;
}

/**
 * @author Joseph Abbey
 * @date 21/02/2023
 * @param {string} input
 * @param {number=} index
 * @param {boolean=} inlineMaths
 * @returns {[number, Node[]]}
 *
 * @description Generates an Abstract Syntax Tree from the given input.
 */
export default function parse(input, index = 0, inlineMaths = false) {
  /** @type {Node[]} */
  var nodes = [];
  main: while (index < input.length) {
    while (
      index < input.length &&
      ['\t', '\n', '\r'].includes(input.charAt(index))
    ) {
      index++;
    }
    switch (input.charAt(index)) {
      case '\\':
        index++;
        let name = '';
        while (
          index < input.length &&
          input.charAt(index).toUpperCase() != input.charAt(index).toLowerCase()
        ) {
          name += input.charAt(index);
          index++;
        }
        /** @type {{ [key: string]: string }=} */
        let keyValueData;
        if (input.charAt(index) == '[') {
          index++;
          let pairs = '';
          while (index < input.length && input.charAt(index) != ']') {
            pairs += input.charAt(index);
            index++;
          }
          index++;
          keyValueData = Object.fromEntries(
            pairs.split(',').map((p) => p.split('='))
          );
        }
        /** @type {Node[]=} */
        let data;
        if (input.charAt(index) == '{') {
          index++;
          let d = parse(input, index);
          if (d instanceof Array) {
            index = d[0];
            data = d[1];
          } else {
            throw new SyntaxError('Invalid');
          }
        }
        if (name == 'begin') {
          index++;
          let c = parse(input, index);
          if (c instanceof Array) {
            index = c[0];
            nodes.push(new Env(c[1], data, keyValueData));
            break;
          } else {
            throw new SyntaxError('Invalid');
          }
        }
        if (name == 'end') {
          return [index, nodes];
        }
        nodes.push(new Tag(name, data, keyValueData));
        break;
      case ')':
      case ']':
      case '}':
        index++;
        return [index, nodes];
      case '^':
        index++;
        if (input.charAt(index) == '{') {
          index++;
          let d = parse(input, index);
          if (d instanceof Array) {
            index = d[0];
            nodes.push(new Tag('^', d[1]));
          } else {
            throw new SyntaxError('Invalid');
          }
        }
        break;
      case '(':
        index++;
        let d = parse(input, index);
        if (d instanceof Array) {
          index = d[0];
          nodes.push(new Brackets(d[1]));
        } else {
          throw new SyntaxError('Invalid');
        }
        break;
      case '[':
        index++;
        let b = parse(input, index);
        if (b instanceof Array) {
          index = b[0];
          nodes.push(new Brackets(b[1], true));
        } else {
          throw new SyntaxError('Invalid');
        }
        break;
      case '$':
        if (inlineMaths) {
          index++;
          return [index, nodes];
        }
        index++;
        let c = parse(input, index, true);
        if (c instanceof Array) {
          index = c[0];
          nodes.push(new InlineMaths(c[1]));
          break;
        } else {
          throw new SyntaxError('Invalid');
        }
      case '&':
        if (input.charAt(index + 1) == '=') {
          index += 2;
          nodes.push(new Tag('&='));
          break;
        }
      default:
        var text = '';
        while (
          index < input.length &&
          input.charAt(index) != '\\' &&
          input.charAt(index) != '$' &&
          input.charAt(index) != ')' &&
          input.charAt(index) != ']' &&
          input.charAt(index) != '}' &&
          input.charAt(index) != '&' &&
          input.charAt(index) != '(' &&
          input.charAt(index) != '[' &&
          input.charAt(index) != '^'
        ) {
          if (input.charAt(index) == '\n' && input.charAt(index + 1) == '\n') {
            index += 2;
            nodes.push(new Text(text), new Break());
            continue main;
          }
          text += input.charAt(index);
          index++;
        }
        nodes.push(new Text(text));
        break;
    }
  }
  return [index, nodes];
}

// TODO: Add support for more tags and environments (Maths, InlineMaths, etc.)
/**
 * @author Joseph Abbey
 * @date 21/02/2023
 * @param {Node[]} input
 * @returns {Article}
 *
 * @description Converts an Abstract Syntax Tree to an Article Object Model.
 */
export function toAOM(input) {
  /** @type {string=} */
  var author;
  /** @type {string=} */
  var title;
  /** @type {Date=} */
  var date;
  /** @type {Package[]} */
  var packages = [];
  /** @type {Element[]} */
  var children = [];

  /**
   * @param {Env} e
   * @returns {Element}
   */
  function env(e) {
    if (e.data && e.data.length == 1 && e.data[0] instanceof Text) {
      /** @type {Element[]} */
      var c = [];
      var t = '';
      var p = new Paragraph({
        id: Element.uuid(),
      });
      /** @type {Section=} */
      var s;
      /** @type {SubSection=} */
      var ss;
      /**
       * @param {Element=} enc
       * @param {Node[]=} enc_c
       * @param {boolean=} inlineMaths
       */
      function r(enc, enc_c, inlineMaths = false) {
        for (let node of enc_c ?? e.children) {
          if (
            t &&
            !(
              node instanceof Text ||
              (!inlineMaths && node instanceof Brackets) ||
              (node instanceof Tag &&
                ['textbf', 'textit', 'underline'].includes(node.tag))
            )
          ) {
            p.children.push(
              new TextElement({
                id: Element.uuid(),
                text: t,
              })
            );
            t = '';
          }
          if (node instanceof Text) {
            if (inlineMaths) {
              node.text.split('').forEach((v) =>
                v == ' '
                  ? null
                  : (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                      new Variable({
                        id: Element.uuid(),
                        var: v,
                      })
                    )
              );
            } else {
              if (enc) {
                enc.children.push(
                  new TextElement({
                    id: Element.uuid(),
                    text: node.text,
                  })
                );
              } else t += node.text;
            }
          } else if (node instanceof InlineMaths) {
            let i = new InlineMathsElement({
              id: Element.uuid(),
              children: [],
            });
            r(i, node.children, true);
            p.children.push(i);
          } else if (node instanceof Brackets) {
            if (inlineMaths) {
              let l = new BracketsElement({
                id: Element.uuid(),
                children: [],
                square: node.square,
              });
              r(l, node.children, inlineMaths);
              (enc?.children ?? p.children).push(l);
            } else {
              t += '(';
              r(enc, node.children);
              t += ')';
            }
          } else if (node instanceof Break) {
            (enc?.children ?? ss?.children ?? s?.children ?? c).push(p);
            p = new Paragraph({ id: Element.uuid() });
          } else if (node instanceof Env) {
            (enc?.children ?? ss?.children ?? s?.children ?? c).push(env(node));
          } else if (node instanceof Tag) {
            switch (node.tag) {
              case 'textbf':
              case 'textit':
              case 'underline':
                /** @param {Node} i */
                function recurse(i) {
                  if (i instanceof Text) {
                    t += i.text;
                  } else if (i instanceof Tag) {
                    switch (i.tag) {
                      case 'textbf':
                        t += '<b>';
                        for (let j of i.data ?? []) recurse(j);
                        t += '</b>';
                        break;
                      case 'textit':
                        t += '<i>';
                        for (let j of i.data ?? []) recurse(j);
                        t += '</i>';
                        break;
                      case 'underline':
                        t += '<u>';
                        for (let j of i.data ?? []) recurse(j);
                        t += '</u>';
                        break;
                      default:
                        throw new SyntaxError('Expected a string.');
                    }
                  } else throw new SyntaxError('Expected a string.');
                }
                recurse(node);
                break;
              case 'pagenumbering':
                if (
                  node.data &&
                  node.data.length == 1 &&
                  node.data[0] instanceof Text
                )
                  (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                    new PageNumbering({
                      id: Element.uuid(),
                      numbering: node.data[0].text,
                    })
                  );
                else throw new SyntaxError('Expected a string.');
                break;
              case '&=':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Equals({
                    id: Element.uuid(),
                  })
                );
                break;
              case 'approx':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Approx({
                    id: Element.uuid(),
                  })
                );
                break;
              case 'textnormal':
                if (
                  node.data &&
                  node.data.length == 1 &&
                  node.data[0] instanceof Text
                ) {
                  (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                    new TextNormal({
                      id: Element.uuid(),
                      text: node.data[0].text,
                    })
                  );
                } else throw new SyntaxError('Expected a string.');
                break;
              case 'vec':
                if (node.data && node.data.length == 1) {
                  if (node.data[0] instanceof Text) {
                    (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                      new Vector({
                        id: Element.uuid(),
                        var: node.data[0].text,
                      })
                    );
                  } else if (node.data[0] instanceof Tag) {
                    if (node.data[0].tag == 'gamma')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'Γ',
                        })
                      );
                    else if (node.data[0].tag == 'delta')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'Δ',
                        })
                      );
                    else if (node.data[0].tag == 'theta')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'Θ',
                        })
                      );
                    else if (node.data[0].tag == 'lambda')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'Λ',
                        })
                      );
                    else if (node.data[0].tag == 'xi')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'Ξ',
                        })
                      );
                    else if (node.data[0].tag == 'pi')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'Π',
                        })
                      );
                    else if (node.data[0].tag == 'sigma')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'Σ',
                        })
                      );
                    else if (node.data[0].tag == 'phi')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'Φ',
                        })
                      );
                    else if (node.data[0].tag == 'psi')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'Ψ',
                        })
                      );
                    else if (node.data[0].tag == 'omega')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'Ω',
                        })
                      );
                    else if (node.data[0].tag == 'alpha')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'α',
                        })
                      );
                    else if (node.data[0].tag == 'beta')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'β',
                        })
                      );
                    else if (node.data[0].tag == 'gamma')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'γ',
                        })
                      );
                    else if (node.data[0].tag == 'delta')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'δ',
                        })
                      );
                    else if (node.data[0].tag == 'epsilon')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'ε',
                        })
                      );
                    else if (node.data[0].tag == 'zeta')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'ζ',
                        })
                      );
                    else if (node.data[0].tag == 'eta')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'η',
                        })
                      );
                    else if (node.data[0].tag == 'theta')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'θ',
                        })
                      );
                    else if (node.data[0].tag == 'iota')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'ι',
                        })
                      );
                    else if (node.data[0].tag == 'kappa')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'κ',
                        })
                      );
                    else if (node.data[0].tag == 'lamda')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'λ',
                        })
                      );
                    else if (node.data[0].tag == 'mu')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'μ',
                        })
                      );
                    else if (node.data[0].tag == 'nu')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'ν',
                        })
                      );
                    else if (node.data[0].tag == 'xi')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'ξ',
                        })
                      );
                    else if (node.data[0].tag == 'pi')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'π',
                        })
                      );
                    else if (node.data[0].tag == 'rho')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'ρ',
                        })
                      );
                    else if (node.data[0].tag == 'sigma')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'σ',
                        })
                      );
                    else if (node.data[0].tag == 'tau')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'τ',
                        })
                      );
                    else if (node.data[0].tag == 'upsilon')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'υ',
                        })
                      );
                    else if (node.data[0].tag == 'phi')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'φ',
                        })
                      );
                    else if (node.data[0].tag == 'chi')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'χ',
                        })
                      );
                    else if (node.data[0].tag == 'psi')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'ψ',
                        })
                      );
                    else if (node.data[0].tag == 'omega')
                      (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                        new Vector({
                          id: Element.uuid(),
                          var: 'ω',
                        })
                      );
                    else throw new SyntaxError('Expected a string.');
                  } else throw new SyntaxError('Expected a string.');
                } else throw new SyntaxError('Expected a string.');
                break;
              case 'alpha':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'α',
                  })
                );
                break;
              case 'beta':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'β',
                  })
                );
                break;
              case 'gamma':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'γ',
                  })
                );
                break;
              case 'delta':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'δ',
                  })
                );
                break;
              case 'epsilon':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'ε',
                  })
                );
                break;
              case 'zeta':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'ζ',
                  })
                );
                break;
              case 'eta':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'η',
                  })
                );
                break;
              case 'theta':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'θ',
                  })
                );
                break;
              case 'iota':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'ι',
                  })
                );
                break;
              case 'kappa':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'κ',
                  })
                );
                break;
              case 'lamda':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'λ',
                  })
                );
                break;
              case 'mu':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'μ',
                  })
                );
                break;
              case 'nu':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'ν',
                  })
                );
                break;
              case 'xi':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'ξ',
                  })
                );
                break;
              case 'pi':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'π',
                  })
                );
                break;
              case 'rho':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'ρ',
                  })
                );
                break;
              case 'sigma':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'σ',
                  })
                );
                break;
              case 'tau':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'τ',
                  })
                );
                break;
              case 'upsilon':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'υ',
                  })
                );
                break;
              case 'phi':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'φ',
                  })
                );
                break;
              case 'chi':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'χ',
                  })
                );
                break;
              case 'psi':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'ψ',
                  })
                );
                break;
              case 'omega':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new Variable({
                    id: Element.uuid(),
                    var: 'ω',
                  })
                );
                break;
              case '^':
                let power = new Power({
                  id: Element.uuid(),
                  children: [],
                });
                r(power, node.data, inlineMaths);
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(power);
                break;
              case 'maketitle':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new MakeTitle({
                    id: Element.uuid(),
                  })
                );
                break;
              case 'newpage':
                (enc?.children ?? ss?.children ?? s?.children ?? c).push(
                  new NewPage({
                    id: Element.uuid(),
                  })
                );
                break;
              case 'section':
                if (
                  node.data &&
                  node.data.length == 1 &&
                  node.data[0] instanceof Text
                ) {
                  if (s) {
                    if (ss) {
                      s.children.push(ss);
                      ss = undefined;
                    }
                    c.push(s);
                  }
                  s = new Section({
                    id: Element.uuid(),
                    title: node.data[0].text,
                  });
                } else throw new SyntaxError('Expected a string.');
                break;
              case 'subsection':
                if (
                  node.data &&
                  node.data.length == 1 &&
                  node.data[0] instanceof Text
                ) {
                  if (s) {
                    if (ss) s.children.push(ss);
                    ss = new SubSection({
                      id: Element.uuid(),
                      title: node.data[0].text,
                    });
                  }
                } else throw new SyntaxError('Expected a string.');
                break;
              default:
                console.error(new SyntaxError('Unsupported tag: ' + node.tag));
              // `throw new SyntaxError('Unsupported tag: ' + node.tag);`
            }
          } else throw new SyntaxError('Invalid');
        }
      }
      r();
      if (s) {
        if (ss) {
          s.children.push(ss);
        }
        c.push(s);
      }
      switch (e.data[0].text) {
        case 'document':
          return new Document({ id: Element.uuid(), children: c });
        default:
          throw new SyntaxError('Invalid environment.');
      }
    } else throw new SyntaxError('Invalid environment.');
  }

  for (let node of input) {
    if (node instanceof Env) {
      children.push(env(node));
    } else if (node instanceof Tag) {
      switch (node.tag) {
        case 'documentclass':
          if (
            !(
              node.data &&
              node.data.length == 1 &&
              node.data[0] instanceof Text &&
              node.data[0].text == 'article'
            )
          )
            throw new SyntaxError(
              'Unsupported document class: ' + node?.data?.[0]?.['text']
            );
          break;
        case 'usepackage':
          if (
            !(
              node.data &&
              node.data.length == 1 &&
              node.data[0] instanceof Text
            )
          )
            throw new SyntaxError('Expected a string.');

          packages.push({
            name: node.data[0].text,
            options: node.keyValueData,
          });
          break;
        case 'title':
          if (
            !(
              node.data &&
              node.data.length == 1 &&
              node.data[0] instanceof Text
            )
          )
            throw new SyntaxError('Expected a string.');

          title = node.data[0].text;
          break;
        case 'author':
          if (
            !(
              node.data &&
              node.data.length == 1 &&
              node.data[0] instanceof Text
            )
          )
            throw new SyntaxError('Expected a string.');

          author = node.data[0].text;
          break;
        case 'date':
          if (node.data && node.data.length == 1) {
            if (node.data[0] instanceof Text) {
              date = new Date(node.data[0].text);
            } else if (
              node.data[0] instanceof Tag &&
              node.data[0].tag == 'today'
            ) {
              date = new Date();
            } else throw new SyntaxError('Expected a string or `\\today`.');
          } else throw new SyntaxError('Expected a string or `\\today`.');
          break;
        default:
          throw new SyntaxError('Unsupported tag: ' + node.tag);
      }
    } else throw new SyntaxError('Expected tag: ');
  }

  return new Article({
    id: Element.uuid(),
    author: author || 'You',
    title: title || 'New Article',
    packages,
    children,
    readonly: false,
    spellcheck: false,
    date,
  });
}
