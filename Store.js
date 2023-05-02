/**
 * @constructor
 * @extends {Event}
 */
export class StoreEvent extends Event {
  /**
   * @param {StoreEvent['type']} type
   * @param {{ key: string }} data
   */
  constructor(type, data) {
    super(type, {});

    this.type = type;
    this.data = data;
  }

  /**
   * @type {"edit" | "create" | "delete"}
   * @inheritdoc
   */
  type;

  /**
   * @type {{ key: string }}
   */
  data;
}

/**
 * @constructor
 * @virtual
 */
export default class Store {
  static icon = 'unknown_document';

  constructor() {
    this.eventListeners = [];
  }

  /**
   * @async
   * @param {string} key
   * @return {Promise<string[]>}
   */
  async absolute(key) {
    return [];
  }

  /**
   * @param {string} key
   * @return {Promise<boolean>}
   */
  async shareable(key) {
    return false;
  }

  /**
   * @async
   * @param {string} key
   * @return {Promise<string | undefined>}
   */
  async share(key) {
    return undefined;
  }

  /**
   * @async
   * @param {string} key
   * @return {Promise<boolean>}
   */
  async has(key) {
    return false;
  }

  /**
   * @async
   * @param {string} key
   * @returns {Promise<(import("./src/Article.js").ArticleSerialised & import("./src/Element.js").ElementSerialised) | undefined>}
   */
  async get(key) {
    return undefined;
  }

  /**
   * @async
   * @param {string} key
   * @param {(import("./src/Article.js").ArticleSerialised & import("./src/Element.js").ElementSerialised)} value
   */
  async set(key, value) {}

  /**
   * @async
   * @param {string} key
   */
  async delete(key) {}

  /**
   * @async
   * @generator
   * @returns {AsyncGenerator<string, void, unknown>}
   */
  async *keys() {}

  /**
   * @type {Object<StoreEvent['type'], Array<(e: StoreEvent) => void>>}
   * @private
   */
  eventListeners;
  /**
   * @param {StoreEvent['type']} type
   * @param {(e: StoreEvent) => void} listener
   * @returns {void}
   */
  addEventListener(type, listener) {
    if (!this.eventListeners[type]) this.eventListeners[type] = [];
    this.eventListeners[type].push(listener);
  }
  /**
   * @param {StoreEvent['type']} type
   * @param {(e: StoreEvent) => void} listener
   * @returns {void}
   */
  removeEventListener(type, listener) {
    const index = this.eventListeners[type].indexOf(listener);
    if (index > -1) this.eventListeners[type].splice(index, 1);
  }
  /**
   * @param {StoreEvent} event
   * @returns {void}
   */
  dispatchEvent(event) {
    this.eventListeners[event.type]?.forEach((f) => f(event));
  }
}

/**
 * @author Joseph Abbey
 * @date 24/02/2023
 * @constructor
 * @extends {Store}
 *
 * @description A `Store` subclass for the localStorage API.
 */
export class LocalStorage extends Store {
  static icon = 'work';

  constructor() {
    super();
    addEventListener('storage', (e) => {
      if (!e.key?.startsWith('document.')) return;
      if (e.oldValue == null)
        this.dispatchEvent(
          new StoreEvent('create', {
            key: e.key.substring(9),
          })
        );
      else if (e.newValue == null)
        this.dispatchEvent(
          new StoreEvent('delete', {
            key: e.key.substring(9),
          })
        );
      else
        this.dispatchEvent(
          new StoreEvent('edit', {
            key: e.key.substring(9),
          })
        );
    });

    (async () => {
      for await (let k of this.keys()) {
        this.dispatchEvent(
          new StoreEvent('create', {
            key: k,
          })
        );
      }
    })();
  }

  /**
   * @async
   * @param {string} key
   * @return {Promise<[string]>}
   */
  async absolute(key) {
    if (key.startsWith('LocalStorage:')) {
      key = key.substring(11);
    }
    return [key];
  }

  /**
   * @async
   * @param {string} key
   * @return {Promise<boolean>}
   */
  async has(key) {
    const [k] = await this.absolute(key);
    return Boolean(localStorage.getItem('document.' + k));
  }

  /**
   * @async
   * @param {string} key
   * @returns {Promise<(import("./src/Article.js").ArticleSerialised & import("./src/Element.js").ElementSerialised) | undefined>}
   */
  async get(key) {
    const [k] = await this.absolute(key);
    return (
      JSON.parse(localStorage.getItem('document.' + k) ?? 'null') ?? undefined
    );
  }

  /**
   * @async
   * @param {string} key
   * @param {(import("./src/Article.js").ArticleSerialised & import("./src/Element.js").ElementSerialised)} value
   */
  async set(key, value) {
    const [k] = await this.absolute(key);
    localStorage.setItem('document.' + k, JSON.stringify(value));
  }

  /**
   * @async
   * @param {string} key
   */
  async delete(key) {
    const [k] = await this.absolute(key);
    localStorage.removeItem('document.' + k);
  }

  /**
   * @async
   * @generator
   * @yields {string}
   * @returns {AsyncGenerator<string, void, unknown>}
   */
  async *keys() {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k?.startsWith('document.')) yield k.substring(9);
    }
  }
}

/**
 * @author Joseph Abbey
 * @date 24/02/2023
 * @constructor
 * @extends {Store}
 *
 * @description A `Store` subclass for the Firebase RealtimeDB API.
 */
export class RealtimeDB extends Store {
  static icon = 'smb_share';

  /**
   * @private
   * @type {Promise<any>}
   */
  _ = this.auth();

  constructor() {
    super();
    this._.then(async (_) => {
      const d = _.ref(`users/${_.userID}/documents`);
      _.onChildAdded(
        d,
        ({ key }) =>
          this.dispatchEvent(
            new StoreEvent('create', {
              key,
            })
          ),
        {}
      );
      _.onChildRemoved(
        d,
        ({ key }) =>
          this.dispatchEvent(
            new StoreEvent('delete', {
              key,
            })
          ),
        {}
      );
      _.onChildChanged(
        d,
        ({ key }) =>
          this.dispatchEvent(
            new StoreEvent('edit', {
              key,
            })
          ),
        {}
      );
    });
  }

  /**
   * @private
   * @async
   * @returns {Promise<{
   *   ref: Function,
   *   set: Function,
   *   get: Function,
   *   remove: Function,
   *   onChildAdded: Function,
   *   onChildRemoved: Function,
   *   onChildChanged: Function,
   *   userID: string,
   *   signOut: Function,
   * }>}
   */
  async auth() {
    const firebase_app =
      'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
    const firebase_database =
      'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';
    const firebase_auth =
      'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
    const firebase_app_check =
      'https://www.gstatic.com/firebasejs/9.17.1/firebase-app-check.js';
    const [
      { initializeApp },
      {
        getDatabase,
        ref,
        set,
        get,
        remove,
        onChildAdded,
        onChildRemoved,
        onChildChanged,
      },
      { getAuth, signInWithPopup, GithubAuthProvider, signOut },
      { initializeAppCheck, ReCaptchaV3Provider },
    ] = await Promise.all([
      import(firebase_app),
      import(firebase_database),
      import(firebase_auth),
      import(firebase_app_check),
    ]);

    const firebaseConfig = {
      apiKey: 'AIzaSyCWCjHVa3ZoA-PjK4dUCM4DtHiBEsJvP7A',
      authDomain: 'jatex-jatex.firebaseapp.com',
      databaseURL:
        'https://jatex-jatex-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: 'jatex-jatex',
      storageBucket: 'jatex-jatex.appspot.com',
      messagingSenderId: '806439819758',
      appId: '1:806439819758:web:bcd499625a317126ad56ff',
    };

    const app = initializeApp(firebaseConfig);

    if (window.location.hostname !== 'localhost')
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(
          '6LcsQrUkAAAAABKGtSVlSHS8kAljR7LxqpNKazSh'
        ),
        isTokenAutoRefreshEnabled: true,
      });

    const auth = getAuth();
    await new Promise((resolve) => auth.onAuthStateChanged(resolve));
    if (!auth.currentUser) {
      const provider = new GithubAuthProvider();
      provider.setCustomParameters({
        allow_signup: 'false',
      });
      await signInWithPopup(auth, provider);
    }

    const database = getDatabase(app);

    return {
      ref: ref.bind(null, database),
      set,
      get,
      remove,
      onChildAdded,
      onChildRemoved,
      onChildChanged,
      userID: auth.currentUser.uid,
      signOut: signOut.bind(null, auth),
    };
  }

  /**
   * @async
   * @param {string} key
   * @return {Promise<[string, string]>}
   */
  async absolute(key) {
    if (key.startsWith('RealtimeDB:')) {
      key = key.substring(11);
    }
    if (key.startsWith('~')) {
      const [user, k] = key.substring(1).split('/');
      return [user, k];
    }
    const _ = await this._;
    return [_.userID, key];
  }

  /**
   * @param {string} key
   * @return {Promise<boolean>}
   */
  async shareable(key) {
    const _ = await this._;
    const [user, k] = await this.absolute(key);
    const d = await _.get(_.ref(`users/${user}/documents/${k}`));
    return d.exists() ? !d.val().private : false;
  }

  /**
   * @async
   * @param {string} key
   * @return {Promise<string | undefined>}
   */
  async share(key) {
    const _ = await this._;
    if (await this.has(key)) {
      if (key.startsWith('~')) {
        return 'RealtimeDB:' + key;
      }
      return `RealtimeDB:~${_.userID}/${key}`;
    }
    return undefined;
  }

  /**
   * @async
   * @param {string} key
   * @return {Promise<boolean>}
   */
  async has(key) {
    const _ = await this._;
    const [user, k] = await this.absolute(key);
    const d = await _.get(_.ref(`users/${user}/documents`));
    return d.hasChild(k);
  }

  /**
   * @async
   * @param {string} key
   * @returns {Promise<(import("./src/Article.js").ArticleSerialised & import("./src/Element.js").ElementSerialised) | undefined>}
   */
  async get(key) {
    const _ = await this._;
    const [user, k] = await this.absolute(key);
    const d = await _.get(_.ref(`users/${user}/documents/${k}`));
    return d.exists() ? JSON.parse(d.val().contents) : undefined;
  }

  /**
   * @async
   * @param {string} key
   * @param {(import("./src/Article.js").ArticleSerialised & import("./src/Element.js").ElementSerialised)} value
   */
  async set(key, value) {
    const _ = await this._;
    const [user, k] = await this.absolute(key);
    // This will essentially create a fork.
    await _.set(_.ref(`users/${_.userID}/documents/${k}`), {
      contents: JSON.stringify(value),
    });
  }

  /**
   * @async
   * @param {string} key
   */
  async delete(key) {
    const _ = await this._;
    const [user, k] = await this.absolute(key);
    await _.remove(_.ref(`users/${_.userID}/documents/${k}`));
  }

  /**
   * @async
   * @generator
   * @yields {string}
   * @returns {AsyncGenerator<string, void, unknown>}
   */
  async *keys() {
    const _ = await this._;
    const d = await _.get(_.ref(`users/${_.userID}/documents`));
    /** @type {string[]} */
    const ks = [];
    d.forEach((/** @type {{ key: string; }} */ child) => {
      ks.push(child.key);
    });
    for (var k of ks) yield k;
  }
}

/**
 * @author Joseph Abbey
 * @date 25/02/2023
 * @constructor
 * @extends {Store}
 *
 * @description A `Store` subclass to interface a set of stores.
 */
export class Bucket extends Store {
  static icon = 'home_storage';

  static stores = {
    LocalStorage,
    RealtimeDB,
  };

  /**
   * @private
   * @type {{ [key in keyof typeof Bucket.stores]?: Store }}
   */
  stores;

  /**
   * @constructor
   * @param {{ [key in keyof typeof Bucket.stores]?: boolean }} stores
   */
  constructor(stores) {
    super();
    this.stores = Object.fromEntries(
      Object.entries(stores)
        .filter(([_, v]) => v)
        .map(([k, _]) => {
          /** @type {Store} */
          const s = new Bucket.stores[k]();
          s.addEventListener('create', (e) =>
            this.dispatchEvent(
              new StoreEvent('create', {
                key: k + ':' + e.data.key,
              })
            )
          );
          s.addEventListener('delete', (e) =>
            this.dispatchEvent(
              new StoreEvent('delete', {
                key: k + ':' + e.data.key,
              })
            )
          );
          s.addEventListener('edit', (e) =>
            this.dispatchEvent(
              new StoreEvent('edit', {
                key: k + ':' + e.data.key,
              })
            )
          );
          return [k, s];
        })
    );
  }

  /**
   * @param {keyof typeof Bucket.stores} store
   */
  enable(store) {
    const s = new Bucket.stores[store]();
    s.addEventListener('create', (e) =>
      this.dispatchEvent(
        new StoreEvent('create', {
          key: store + ':' + e.data.key,
        })
      )
    );
    s.addEventListener('delete', (e) =>
      this.dispatchEvent(
        new StoreEvent('delete', {
          key: store + ':' + e.data.key,
        })
      )
    );
    s.addEventListener('edit', (e) =>
      this.dispatchEvent(
        new StoreEvent('edit', {
          key: store + ':' + e.data.key,
        })
      )
    );
    this.stores[store] = s;
  }

  /**
   * @param {keyof typeof Bucket.stores} store
   * @returns {boolean}
   */
  enabled(store) {
    return Boolean(this.stores[store]);
  }

  /**
   * @param {keyof typeof Bucket.stores} store
   */
  disable(store) {
    delete this.stores[store];
  }

  /**
   * @returns {(keyof typeof Bucket.stores)[]}
   */
  enabledStores() {
    //@ts-expect-error
    return Object.keys(this.stores);
  }

  /**
   * @async
   * @param {string} key
   * @return {Promise<[string, string]>}
   */
  async absolute(key) {
    const [store, k] = key.split(':');
    return [store, k];
  }

  /**
   * @param {string} key
   * @return {Promise<boolean>}
   */
  async shareable(key) {
    const [store, k] = await this.absolute(key);
    return Boolean(await this.stores[store]?.shareable(k));
  }

  /**
   * @async
   * @param {string} key
   * @return {Promise<string | undefined>}
   */
  async share(key) {
    const [store, k] = await this.absolute(key);
    return await this.stores[store]?.share(k);
  }

  /**
   * @async
   * @param {string} key
   * @return {Promise<boolean>}
   */
  async has(key) {
    const [store, k] = await this.absolute(key);
    return Boolean(await this.stores[store]?.has(k));
  }

  /**
   * @async
   * @param {string} key
   * @returns {Promise<(import("./src/Article.js").ArticleSerialised & import("./src/Element.js").ElementSerialised) | undefined>}
   */
  async get(key) {
    const [store, k] = await this.absolute(key);
    return this.stores[store]?.get(k);
  }

  /**
   * @async
   * @param {string} key
   * @param {(import("./src/Article.js").ArticleSerialised & import("./src/Element.js").ElementSerialised)} value
   */
  async set(key, value) {
    const [store, k] = await this.absolute(key);
    await this.stores[store]?.set(k, value);
  }

  /**
   * @async
   * @param {string} key
   */
  async delete(key) {
    const [store, k] = await this.absolute(key);
    await this.stores[store]?.delete(k);
  }

  /**
   * @async
   * @param {string} key
   * @param {keyof typeof Bucket.stores} store
   */
  async move(key, store) {
    const [_, k] = await this.absolute(key);
    const value = await this.get(key);
    if (value) {
      await Promise.all([this.set(store + ':' + k, value), this.delete(key)]);
    }
    return store + ':' + k;
  }

  /**
   * @async
   * @generator
   * @yields {string}
   * @returns {AsyncGenerator<string, void, unknown>}
   */
  async *keys() {
    for (var s in this.stores)
      for await (var k of this.stores[s].keys()) yield s + ':' + k;
  }
}
