import {
  addButton,
  addCommand,
  addCtrlKey,
  open,
  recent,
  reload,
  select_store,
  store,
  url,
} from './index.js';
import { Article, Element, ElementEvent, parse, AST } from './src/index.js';

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

/**
 * @param {String} key
 * @param {Article} article
 * @description Saves the article to local storage.
 */
function save(key, article) {
  store.set(key, article.serialised);
  if (document.title.startsWith('● ')) {
    document.querySelector('#save_btn')?.classList.remove('required');
    document.title = document.title.substring(2);
    window.removeEventListener('beforeunload', beforeunload);
  }
}

/**
 * @param {String} key
 * @param {Article} article
 * @description Shows the share sheet.
 */
async function share(key, article) {
  let url = await store.share(key);
  if (url == undefined) return;
  url = 'https://jatex.josephabbey.dev/?article=' + url;

  if (navigator.canShare({ url }))
    await navigator.share({
      title: article.title,
      text: 'View article on JaTeX.',
      url,
    });
  else alert(url);
}

/**
 * @param {String} key
 * @description Deletes the article in local storage.
 */
function reset(key) {
  store.delete(key);
  recent();
}

/**
 * @param {String} key
 * @param {Article} article
 * @description It opens a new window, with the LaTeX code of the article in.
 */
function showLaTeX(key, article) {
  /** @type {HTMLDialogElement?} */
  var dialog = document.createElement('dialog');
  if (dialog) {
    dialog.id = 'latex';
    dialog.innerHTML = '';
    var p = document.createElement('textarea');
    p.readOnly = article.readonly;
    var i = (p.value = article.tex);
    dialog.appendChild(p);
    dialog.addEventListener('close', (e) => {
      if (!article.readonly && i !== p.value) {
        store.set(key, AST.toAOM(parse(p.value)[1]).serialised);
        window.location.reload();
      }
      dialog?.remove();
    });
    document.body.appendChild(dialog);
    dialog.showModal();
  }
}

/**
 * @param {string} id - The id of the button.
 * @param {(this: HTMLButtonElement, ev: MouseEvent) => any} click - The function to call when the button is clicked.
 * @param {string?} ariaLabel - The text that will be read by screen readers.
 * @param {string} title - The text that appears when you hover over the button.
 * @param {string} icon - the icon to use for the button.
 * @returns {HTMLButtonElement} The button element.
 * @description It creates a button element, sets its id, aria-label, title, and icon, and then appends it to the edit controls.
 */
function addEditControl(id, click, ariaLabel, title, icon) {
  var btn = document.createElement('button');
  btn.id = id;
  btn.ariaLabel = ariaLabel;
  btn.title = title;
  var icn = document.createElement('span');
  icn.className = 'material-symbols-outlined';
  icn.innerHTML = icon;
  btn.append(icn);
  document.querySelector('#edit_controls > div')?.append(btn);
  btn.addEventListener('click', click, false);
  return btn;
}

/** */
export default async function sketch() {
  Element.map.clear();
  if (!url.searchParams.has('article')) return recent();
  const key = url.searchParams.get('article') ?? '';
  var s = await store.get(key);
  if (!s) return recent();
  var article = Article.deserialise(s);

  var root = document.createElement('div');
  root.id = 'root';
  root.appendChild(article.dom);
  var edit_controls = document.createElement('div');
  edit_controls.id = 'edit_controls';
  edit_controls.style.setProperty('display', article.readonly ? 'none' : '');
  var edit_controls_div = document.createElement('div');
  edit_controls.appendChild(edit_controls_div);
  var main = document.querySelector('main');
  if (main) {
    main.appendChild(root);
    main.appendChild(edit_controls);
  }

  document.title = article.title;

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
    // console.log(c);

    if (!document.title.startsWith('● ')) {
      document.querySelector('#save_btn')?.classList.add('required');
      document.title = '● ' + document.title;
      window.addEventListener('beforeunload', beforeunload);
    }
  });

  addButton('recent_btn', recent, 'Recent', 'Recent', 'update');
  const save_btn = addButton(
    'save_btn',
    () => save(key, article),
    'Save',
    'Save ctrl+s',
    'save'
  );
  save_btn.disabled = article.readonly;
  addButton('print_btn', () => print(), 'Print', 'Print ctrl+p', 'print');
  const share_btn = addButton(
    'share_btn',
    () => share(key, article),
    'Share',
    'Share ctrl+p',
    'share'
  );
  store.shareable(key).then((d) => (share_btn.disabled = !d));
  addButton(
    'show_latex_btn',
    () => showLaTeX(key, article),
    'Show LaTeX Code',
    'Show LaTeX Code ctrl+e',
    'code_blocks'
  );
  if (store.enabledStores().length != 1)
    addButton(
      'move_btn',
      async () => open(await store.move(key, await select_store())),
      'Move',
      'Move',
      'file_copy'
    );
  addButton('reset_btn', () => reset(key), 'Delete', 'Delete ctrl+d', 'delete');

  addEditControl(
    'bold_btn',
    () => document.execCommand('bold'),
    'Bold',
    'Bold',
    'format_bold'
  );
  addEditControl(
    'italic_btn',
    () => document.execCommand('italic'),
    'Italicise',
    'Italicise',
    'format_italic'
  );
  addEditControl(
    'underline_btn',
    () => document.execCommand('underline'),
    'Underline',
    'Underline',
    'format_underlined'
  );

  addCommand(
    'toggle_spellcheck',
    () => (
      // You may need to enable spell check in chrome://settings/languages
      (article.spellcheck = !article.spellcheck),
      Element.map.forEach((e) => e.update())
    ),
    'Toggle spell check',
    () => (article.spellcheck ? 'toggle_on' : 'toggle_off')
  );
  addCommand(
    'toggle_readonly',
    () => (
      (article.readonly = !article.readonly),
      Element.map.forEach((e) => e.update()),
      edit_controls.style.setProperty(
        'display',
        article.readonly ? 'none' : ''
      ),
      (save_btn.disabled = article.readonly)
    ),
    'Toggle readonly mode',
    () => (article.readonly ? 'toggle_on' : 'toggle_off')
  );

  addCtrlKey('s', () => save(key, article));
  addCtrlKey('e', () => showLaTeX(key, article));
  addCtrlKey('d', () => reset(key));

  const webrtc = async () => {
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
        push,
        remove,
        onValue,
        child,
        onChildAdded,
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

    const db = getDatabase(app);

    /** @type {RTCConfiguration} */
    const configuration = {
      iceServers: [
        {
          urls: [
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
          ],
        },
      ],
      iceCandidatePoolSize: 10,
    };

    /** @type {RTCPeerConnection?} */
    let peerConnection = null;
    /** @type {RTCDataChannel | undefined | null} */
    let dataChannel = null;
    let roomRef = null;

    /** */
    async function createRoom() {
      roomRef = push(ref(db, 'rooms'));

      console.log('Create PeerConnection with configuration: ', configuration);
      peerConnection = new RTCPeerConnection(configuration);

      registerPeerConnectionListeners();

      const callerCandidatesCollection = child(roomRef, 'callerCandidates');

      peerConnection.addEventListener('icecandidate', (event) => {
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate: ', event.candidate);
        set(push(callerCandidatesCollection), event.candidate.toJSON());
      });

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log('Created offer:', offer);

      const roomWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
      };
      await set(roomRef, roomWithOffer);
      console.log(`New room created with SDP offer. Room ID:`, roomRef.key);

      onValue(roomRef, async (snapshot) => {
        const data = snapshot.val();
        if (!peerConnection?.currentRemoteDescription && data && data.answer) {
          console.log('Got remote description:', data.answer);
          const rtcSessionDescription = new RTCSessionDescription(data.answer);
          await peerConnection?.setRemoteDescription(rtcSessionDescription);
        }
      });

      onChildAdded(callerCandidatesCollection, async (change) => {
        let data = change.val();
        console.log('Got new remote ICE candidate:', data);
        await peerConnection?.addIceCandidate(new RTCIceCandidate(data));
      });

      dataChannel = peerConnection.createDataChannel('edits');

      dataChannel.addEventListener('open', (event) => {
        console.log('open', event);
      });

      dataChannel.addEventListener('close', (event) => {
        console.log('close', event);
      });
    }

    /** */
    async function joinRoomById(roomId) {
      roomRef = ref(db, `rooms/${roomId}`);
      const roomSnapshot = await get(roomRef);
      console.log('Got room:', roomSnapshot.exists());

      if (roomSnapshot.exists()) {
        console.log('Create PeerConnection with configuration:', configuration);
        peerConnection = new RTCPeerConnection(configuration);

        registerPeerConnectionListeners();

        // Code for collecting ICE candidates below
        const calleeCandidatesCollection = child(roomRef, 'calleeCandidates');
        peerConnection.addEventListener('icecandidate', (event) => {
          if (!event.candidate) {
            console.log('Got final candidate!');
            return;
          }
          console.log('Got candidate: ', event.candidate);
          set(push(calleeCandidatesCollection), event.candidate.toJSON());
        });
        // Code for collecting ICE candidates above

        // Code for creating SDP answer below
        const offer = roomSnapshot.val().offer;
        console.log('Got offer:', offer);
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.createAnswer();
        console.log('Created answer:', answer);
        await peerConnection.setLocalDescription(answer);

        const roomWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };
        await set(roomRef, roomWithAnswer);

        onChildAdded(child(roomRef, 'callerCandidates'), async (change) => {
          let data = change.val();
          console.log('Got new remote ICE candidate:', data);
          await peerConnection?.addIceCandidate(new RTCIceCandidate(data));
        });

        peerConnection.addEventListener('datachannel', (event) => {
          dataChannel = event.channel;
        });
      }
    }

    /** */
    async function hangUp() {
      if (dataChannel) {
        dataChannel.close();
      }
      if (peerConnection) {
        peerConnection.close();
      }

      // Delete room on hangup
      if (roomRef) {
        const calleeCandidates = await get(child(roomRef, 'calleeCandidates'));
        calleeCandidates.forEach(async (candidate) => {
          console.log(candidate);
          await remove(candidate);
        });
        const callerCandidates = await get(child(roomRef, 'callerCandidates'));
        callerCandidates.forEach(async (candidate) => {
          console.log(candidate);
          await remove(candidate);
        });
        await remove(roomRef);
      }
    }

    /** */
    function registerPeerConnectionListeners() {
      peerConnection?.addEventListener('icegatheringstatechange', () => {
        console.log(
          `ICE gathering state changed: ${peerConnection?.iceGatheringState}`
        );
      });

      peerConnection?.addEventListener('connectionstatechange', () => {
        console.log(
          `Connection state change: ${peerConnection?.connectionState}`
        );
      });

      peerConnection?.addEventListener('signalingstatechange', () => {
        console.log(
          `Signaling state change: ${peerConnection?.signalingState}`
        );
      });

      peerConnection?.addEventListener('iceconnectionstatechange ', () => {
        console.log(
          `ICE connection state change: ${peerConnection?.iceConnectionState}`
        );
      });
    }

    window.addEventListener('unload', hangUp);

    window.rtc = {
      createRoom,
      joinRoomById,
      hangUp,
      dataChannel: () => dataChannel,
    };
  };
  webrtc();

  const d = ({ data: { key: article } }) => article == key && recent();
  const e = ({ data: { key: article } }) => article == key && reload();

  store.addEventListener('delete', d);
  store.addEventListener('edit', e);

  return () => {
    store.removeEventListener('delete', d);
    store.removeEventListener('edit', e);
  };
}
