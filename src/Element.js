/**
 * @module Element
 */

/**
 * @author Joseph Abbey
 * @date 05/02/2023
 * @constructor
 * @extends {Map<string, any>}
 *
 * @description Used to map element type names to element constructors for serialisation and deserialisation.
 */
export class ElementRegistry extends Map {}

/**
 * @author Joseph Abbey
 * @date 04/02/2023
 * @constructor
 * @extends {Map<string,Element>}
 *
 * @description Used to map element ids to elements.
 */
export class ElementMap extends Map {}

/**
 * @author Joseph Abbey
 * @date 28/01/2023
 * @constructor
 * @extends {Error}
 *
 * @description Used to throw element specific errors.
 */
export class ElementError extends Error {}

/**
 * @typedef {"removeChild" | "appendChild" | "insertChildAfter" | "spliceChildren" | "childEvent"} GenericElementEventTypes
 */

/**
 * @author Joseph Abbey
 * @date 04/02/2023
 * @constructor
 * @extends {Event}
 * @template {Element} E
 * @template {string} T
 *
 * @description Used to trigger element specific events.
 */
export class ElementEvent extends Event {
  /**
   * @author Joseph Abbey
   * @date 04/02/2023
   * @param {GenericElementEventTypes | T} type
   * @param {E} targetElement
   * @param {object?} [data]
   */
  constructor(type, targetElement, data) {
    super(type, {});

    this.type = type;

    this.targetElement = targetElement;

    this.data = data || {};
  }

  /**
   * @author Joseph Abbey
   * @date 04/02/2023
   * @type {GenericElementEventTypes | T}
   * @inheritdoc
   *
   * @description The event type.
   */
  type;

  /**
   * @author Joseph Abbey
   * @date 04/02/2023
   * @type {E}
   *
   * @description The element that triggered this event.
   */
  targetElement;

  /**
   * @author Joseph Abbey
   * @date 04/02/2023
   * @type {object}
   *
   * @description The data about this event.
   */
  data;
}

/**
 * @callback ElementEventListener
 * @param {E} event
 * @returns {void}
 * @template {ElementEvent} E
 */

/**
 * @typedef ElementOptions
 * @prop {string} id - The id of the element.
 * @prop {Element[]?} [children] - The children of the element.
 */

/**
 * @typedef ElementSerialised
 * @prop {string} class - The constructor of the element.
 * @prop {string} id - The id of the element.
 * @prop {ElementSerialised[]} children - The children of the element.
 */

/**
 * @author Joseph Abbey
 * @date 28/01/2023
 * @constructor
 * @abstract
 * @template {ElementEvent<Element, string>} E
 *
 * @description Base class for elements. Never directly instantiated.
 */
export default class Element {
  static uuid() {
    // Public Domain/MIT
    var d = new Date().getTime(); // Timestamp
    var d2 =
      (typeof performance !== 'undefined' &&
        performance.now &&
        performance.now() * 1000) ||
      0; // Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16; // Random number between 0 and 16
        if (d > 0) {
          // Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          // Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementSerialised}
   *
   * @description This element as a serialised object.
   */
  get serialised() {
    return {
      class: this.constructor.name,
      id: this.id,
      children: this.children.map((child) => child.serialised),
    };
  }

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {ElementRegistry}
   *
   * @description Gets or creates the element registry.
   *
   * @see {@link Element.deserialise}
   */
  static get registry() {
    //@ts-expect-error
    if (window._iElementRegistry) return window._iElementRegistry;
    //@ts-expect-error
    return (window._iElementRegistry = new ElementRegistry());
  }

  static register() {
    Element.registry.set(this.name, this);
  }

  /**
   * @author Joseph Abbey
   * @date 11/02/2023
   * @type {ElementMap}
   *
   * @description Gets or creates the element map.
   */
  static get map() {
    //@ts-expect-error
    if (window._iElementMap) return window._iElementMap;
    //@ts-expect-error
    return (window._iElementMap = new ElementMap());
  }

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @param {ElementSerialised[]} s
   * @returns {Element[]}
   *
   * @description This deserialises many elements.
   *
   * @see {@link Element~serialised}
   */
  static deserialiseMany(s) {
    return s.map((e) =>
      e ? (Element.registry.get(e.class) ?? Element).deserialise(e) : e
    );
  }

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @param {Object<string, any> & ElementSerialised} s
   * @returns {Element}
   *
   * @description This deserialises an element.
   *
   * @see {@link Element~serialised}
   */
  static deserialise(s) {
    return new (Element.registry.get(s.class) ?? Element)({
      ...s,
      children: Element.deserialiseMany(s.children),
    });
  }

  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @param {ElementOptions} options - A configuration object.
   *
   * @description This constructor should not be used directly.
   */
  constructor(options) {
    if (!options.id) throw new ElementError('An ID must be provided.');
    this.id = options.id;

    if (Element.map.has(options.id))
      throw new ElementError('IDs must be unique.');

    this.children = options.children ?? [];
    this.children.forEach((e) => (e.parent = this));

    this.eventListeners = {};

    Element.map.set(this.id, this);
  }

  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @type {string}
   *
   * @description The id of the element.
   */
  id;

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @type {Element?}
   *
   * @description The parent of the element.
   */
  parent;

  delete() {
    this.parent?.removeChild(this);
    this.dispatchEvent(
      //@ts-expect-error
      new ElementEvent('delete', this, {})
    );
  }

  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @param {Element} c
   * @returns {void}
   *
   * @description Function to add a child element to the element.
   */
  appendChild(c) {
    this.children.push(c);
    c.parent = this;
    this.updateDom();
    this.dispatchEvent(
      //@ts-expect-error
      new ElementEvent('appendChild', this, {
        child: c,
      })
    );
  }
  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @param {Element} c
   * @param {Element} o - Other element.
   * @returns {void}
   *
   * @description Function to add a child element to the element after another element.
   */
  insertChildAfter(c, o) {
    const index = this.children.findIndex((e) => e.id == o.id);
    if (index > -1) this.children.splice(index + 1, 0, c);
    c.parent = this;
    this.updateDom();
    this.dispatchEvent(
      //@ts-expect-error
      new ElementEvent('insertChildAfter', this, {
        child: c,
        other: o,
      })
    );
  }
  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @param {Element} c
   * @returns {void}
   *
   * @description Function to remove a child element from the element.
   */
  removeChild(c) {
    const index = this.children.findIndex((e) => e.id == c.id);
    if (index > -1) this.children.splice(index, 1);
    this.updateDom();
    this.dispatchEvent(
      //@ts-expect-error
      new ElementEvent('removeChild', this, {
        child: c,
      })
    );
    Element.map.delete(c.id);
  }

  /**
   * @author Joseph Abbey
   * @date 12/02/2023
   *
   * @warning This method does not delete the returned children from the element map {@link Element.map}.
   *
   * @see {@link Array.splice}
   * @param {number} start The zero-based location in the array from which to start removing elements.
   * @param {number=} deleteCount The number of elements to remove.
   * @param {Element[]} items Elements to insert into the array in place of the deleted elements.
   * @returns {Element[]} An array containing the elements that were deleted.
   *
   * @description Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
   */
  spliceChildren(start, deleteCount, ...items) {
    var r = deleteCount
      ? this.children.splice(start, deleteCount, ...items)
      : this.children.splice(start);
    this.updateDom();
    this.dispatchEvent(
      //@ts-expect-error
      new ElementEvent('spliceChildren', this, {
        start,
        deleteCount,
        items,
      })
    );
    r.forEach((c) => (c.parent = null));
    return r;
  }
  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @type {Element[]}
   *
   * @description The children of the element.
   */
  children;
  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @type {HTMLElement[]}
   *
   * @description Gets or creates the HTMLElements linked with this instance's children.
   */
  get cdom() {
    return this.children.map((c) => c.dom);
  }
  /**
   * @author Joseph Abbey
   * @date 29/01/2023
   * @type {String}
   *
   * @description The LaTeX code that generates this instance's children.
   */
  get ctex() {
    return this.children.map((c) => c.tex).join('');
  }

  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @protected
   * @type {HTMLElement?}
   * @see {@link dom} instead.
   *
   * @description Internal dom cache, use `this.dom` instead.
   */
  _dom;
  /**
   * @author Joseph Abbey
   * @date 05/02/2023
   * @virtual
   *
   * @description Function to update dom.
   */
  updateDom() {
    if (!this._dom)
      throw new ElementError(
        'Please create a DOM node before you call `updateDom`.'
      );
    this._dom.innerHTML = '';
    this._dom.id = this.id;
    this._dom.dataset.type = this.constructor.name;
    this._dom.append(...this.cdom);
  }
  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @protected
   * @virtual
   * @returns {HTMLElement}
   * @see {@link dom} instead.
   *
   * @description Function to create dom, use `this.dom` instead.
   */
  createDom() {
    this._dom = document.createElement('div');
    this.updateDom();
    return this._dom;
  }
  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @type {HTMLElement}
   *
   * @description Gets or creates the HTMLElement linked with this instance.
   */
  get dom() {
    if (!this._dom) return this.createDom();
    return this._dom;
  }

  /**
   * @author Joseph Abbey
   * @date 28/01/2023
   * @type {String}
   *
   * @description The LaTeX code that generates this instance.
   */
  get tex() {
    return '';
  }

  /**
   * @author Joseph Abbey
   * @date 04/02/2023
   * @type {Object<string,Array<ElementEventListener<E>>>}
   * @private
   *
   * @description Function to add an event listener to the element.
   */
  eventListeners;
  /**
   * @author Joseph Abbey
   * @date 04/02/2023
   * @param {string} type
   * @param {ElementEventListener<E>} listener - Function to handle the event.
   * @returns {void}
   *
   * @description Function to add an event listener to the element.
   */
  addEventListener(type, listener) {
    if (!this.eventListeners[type]) this.eventListeners[type] = [];
    this.eventListeners[type].push(listener);
  }
  /**
   * @author Joseph Abbey
   * @date 04/02/2023
   * @param {string} type
   * @param {ElementEventListener<E>} listener - Function to handle the event.
   * @returns {void}
   *
   * @description Function to remove an event listener from the element.
   */
  removeEventListener(type, listener) {
    const index = this.eventListeners[type].indexOf(listener);
    if (index > -1) this.eventListeners[type].splice(index, 1);
  }
  /**
   * @author Joseph Abbey
   * @date 04/02/2023
   * @param {E} event - Data to emit with event.
   * @returns {void}
   *
   * @description Function to emit an event.
   */
  dispatchEvent(event) {
    if (!this.eventListeners[event.type]) this.eventListeners[event.type] = [];
    this.eventListeners[event.type].forEach((f) => f(event));
    this.parent?.dispatchEvent(new ElementEvent('childEvent', this, event));
  }
}

Element.register();
