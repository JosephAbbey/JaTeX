import { getArticleIDs } from './index.js';

var articles = document.querySelector('#articles');

if (articles)
  for (var article of getArticleIDs()) {
    var articleData = JSON.parse(
      localStorage.getItem('article.' + article) ?? '{}'
    );
    var a = document.createElement('a');
    var a_div = document.createElement('div');
    var a_div_0 = document.createElement('div');
    var a_div_1 = document.createElement('div');
    var a_div_1_b = document.createElement('b');
    var a_div_2 = document.createElement('div');

    a.href = '/?article=' + article;
    a_div_1.innerText = 'By ';
    a_div_0.innerText = articleData.title;
    a_div_1_b.innerText = articleData.author;
    // TODO: add actual date.
    a_div_2.innerText = new Date().toLocaleDateString();

    a_div_1.append(a_div_1_b);
    a_div.append(a_div_0, a_div_1, a_div_2);
    a.append(a_div);
    articles.append(a);
  }
