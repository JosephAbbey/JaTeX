import { addButton, fuzzy, open, reload, store } from './index.js';

/** */
export default async function recent() {
  document.title = 'JaTeX - Recent';
  var articles = document.createElement('div');
  articles.id = 'articles';
  document.querySelector('main')?.appendChild(articles);

  if (articles)
    for await (let article of store.keys()) {
      var articleData = await store.get(article);
      if (!articleData) continue;
      var a = document.createElement('a');
      var a_div = document.createElement('div');
      var a_div_0 = document.createElement('div');
      var a_div_1 = document.createElement('div');
      var a_div_1_b = document.createElement('b');
      var a_div_2 = document.createElement('div');

      a.addEventListener('click', () => open(article));
      a_div_1.innerText = 'By ';
      a_div_0.innerText = articleData.title;
      a_div_1_b.innerText = articleData.author;
      a_div_2.innerText = articleData.date
        ? new Date(articleData.date).toLocaleString()
        : new Date().toLocaleString();

      a_div_1.append(a_div_1_b);
      a_div.append(a_div_0, a_div_1, a_div_2);
      a.append(a_div);
      articles.append(a);
    }

  addButton('reload_btn', () => reload(), 'Refresh', 'Refresh', 'refresh');

  document.querySelector('#command_input')?.addEventListener('input', (e) => {
    document.querySelectorAll('#articles > a').forEach(
      (el) =>
        //@ts-expect-error
        (el.style.display =
          fuzzy(
            el.children[0].children[0].innerHTML,
            //@ts-expect-error
            e.target?.value ?? ''
          ) ||
          fuzzy(
            el.children[0].children[1].children[0].innerHTML,
            //@ts-expect-error
            e.target?.value ?? ''
          ) ||
          fuzzy(
            el.children[0].children[2].innerHTML,
            //@ts-expect-error
            e.target?.value ?? ''
          )
            ? 'list-item'
            : 'none')
    );
  });
}
