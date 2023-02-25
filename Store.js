// TODO: listen to change events
// TODO: create bucket class to get items from multiple stores

/**
 * @author Joseph Abbey
 * @date 24/02/2023
 * @constructor
 * @virtual
 *
 * @description A generic store for articles that can be extended for use with storage APIs.
 */
export default class Store {
  constructor() {}

  /**
   * @async
   * @param {string} key
   * @return {Promise<string[]>}
   */
  async absolute(key) {
    return [];
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
   * @returns {Promise<import("./src/Article.js").ArticleSerialised | undefined>}
   */
  async get(key) {
    return undefined;
  }

  /**
   * @async
   * @param {string} key
   * @param {import("./src/Article.js").ArticleSerialised} value
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
  constructor() {
    super();
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
    const [k] = this.absolute(key);
    return Boolean(localStorage.getItem('document.' + k));
  }

  /**
   * @async
   * @param {string} key
   * @returns {Promise<import("./src/Article.js").ArticleSerialised | undefined>}
   */
  async get(key) {
    const [k] = this.absolute(key);
    return (
      JSON.parse(localStorage.getItem('document.' + k) ?? 'null') ?? undefined
    );
  }

  /**
   * @async
   * @param {string} key
   * @param {import("./src/Article.js").ArticleSerialised} value
   */
  async set(key, value) {
    const [k] = this.absolute(key);
    localStorage.setItem('document.' + k, JSON.stringify(value));
  }

  /**
   * @async
   * @param {string} key
   */
  async delete(key) {
    const [k] = this.absolute(key);
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
      if (k?.startsWith('document.')) yield k.substring(8);
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
  constructor() {
    super();
    this._ = this.auth();
  }

  /**
   * @private
   * @type {Promise<any>}
   */
  _;

  /**
   * @private
   * @async
   * @returns {Promise<any>}
   */
  async auth() {
    const firebase_app =
      'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
    const firebase_database =
      'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';
    const firebase_auth =
      'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
    const [
      { initializeApp },
      { getDatabase, ref, set, get, remove },
      { getAuth, signInWithPopup, GithubAuthProvider, signOut },
    ] = await Promise.all([
      import(firebase_app),
      import(firebase_database),
      import(firebase_auth),
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
   * @returns {Promise<import("./src/Article.js").ArticleSerialised | undefined>}
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
   * @param {import("./src/Article.js").ArticleSerialised} value
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
    const ks = [];
    d.forEach((child) => {
      ks.push(child.key);
    });
    for (var k of ks) yield k;
  }
}
