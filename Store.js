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
   * @return {Promise<boolean>}
   */
  async has(key) {
    return Boolean(localStorage.getItem('document.' + key));
  }

  /**
   * @async
   * @param {string} key
   * @returns {Promise<import("./src/Article.js").ArticleSerialised | undefined>}
   */
  async get(key) {
    return (
      JSON.parse(localStorage.getItem('document.' + key) ?? 'null') ?? undefined
    );
  }

  /**
   * @async
   * @param {string} key
   * @param {import("./src/Article.js").ArticleSerialised} value
   */
  async set(key, value) {
    localStorage.setItem('document.' + key, JSON.stringify(value));
  }

  /**
   * @async
   * @param {string} key
   */
  async delete(key) {
    localStorage.removeItem('document.' + key);
  }

  /**
   * @async
   * @generator
   * @yields {string}
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
    const [
      { initializeApp },
      { getDatabase, ref, set, get, remove },
      { getAuth, signInWithPopup, GithubAuthProvider, signOut },
    ] = await Promise.all([
      import(
        // @ts-ignore
        'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js'
      ),
      import(
        // @ts-ignore
        'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js'
      ),
      import(
        // @ts-ignore
        'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js'
      ),
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
   * @return {Promise<boolean>}
   */
  async has(key) {
    const data = await this._;
    const d = await data.get(data.ref(`users/${data.userID}/documents`));
    return d.hasChild(key);
  }

  /**
   * @async
   * @param {string} key
   * @returns {Promise<import("./src/Article.js").ArticleSerialised | undefined>}
   */
  async get(key) {
    const data = await this._;
    const d = await data.get(data.ref(`users/${data.userID}/documents/${key}`));
    return d.exists() ? JSON.parse(d.val().contents) : undefined;
  }

  /**
   * @async
   * @param {string} key
   * @param {import("./src/Article.js").ArticleSerialised} value
   */
  async set(key, value) {
    const data = await this._;
    await data.set(data.ref(`users/${data.userID}/documents/${key}`), {
      contents: JSON.stringify(value),
    });
  }

  /**
   * @async
   * @param {string} key
   */
  async delete(key) {
    const data = await this._;
    await data.remove(data.ref(`users/${data.userID}/documents/${key}`));
  }

  /**
   * @async
   * @generator
   * @yields {string}
   */
  async *keys() {
    const data = await this._;
    const d = await data.get(data.ref(`users/${data.userID}/documents`));
    const ks = [];
    d.forEach((child) => {
      ks.push(child.key);
    });
    for (var k of ks) yield k;
  }
}
