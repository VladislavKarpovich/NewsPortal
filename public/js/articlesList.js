const articleList = (function () {
  const ARTICLES_AMOUNT = 6;

  let filter = {};
  let paginationPosition = 0;
  let paginationPagesAmount = 1;

  function displayArticles(articles) {
    const container = heyClassName('article-list')[0];
    articles.forEach((item) => {
      const html = convertToHTML(item);
      container.appendChild(html);
    });
  }

  function showArticleList(articles) {
    heyId('article-list-page').style.display = 'block';
    heyId('post-page').style.display = 'none';

    if (!articles || !articles.length) {
      heyId('article-not-found-message').style.display = 'block';
      return;
    }
    heyId('article-not-found-message').style.display = 'none';
    displayArticles(articles);
  }

  function convertToHTML(article) {
    const id = article._id;
    const img = article.img;
    const title = article.title;
    const shortDescr = article.shortDescription;
    const author = article.author;
    const date = convDate(article.createdAt);
    const tags = article.tags.join(' ').trim();

    const temp = heyQuery('#template-article-item').content;
    temp.querySelector('article').id = id;
    temp.querySelector('.post-image').src = img;
    temp.querySelector('h2').textContent = title;
    temp.querySelector('p').textContent = shortDescr;
    temp.querySelector('.author-name').textContent = author;
    temp.querySelector('.publication-date').textContent = date;
    temp.querySelector('.post-tags').textContent = tags;

    return temp.querySelector('article').cloneNode(true);
  }

  function convDate(date) {
    return `${date.getUTCFullYear()}/${
      (`0${date.getUTCMonth() + 1}`).slice(-2)}/${
      (`0${date.getUTCDate()}`).slice(-2)} ${
      (`0${date.getUTCHours()}`).slice(-2)}:${
      (`0${date.getUTCMinutes()}`).slice(-2)}`;
  }

  function findHeaderButton(buttonText) {
    const bs = queryAll('#header-menu nav button');
    const find = Array.prototype.find;
    return find.call(bs, a => a.textContent === buttonText);
  }

  function hidePostPageForm() {
    heyId('overlay').style.display = 'none';
    heyId('post-page').style.display = 'none';
    document.body.style.overflowY = '';
  }

  function tagClickHandler(event) {
    const t = event.target;
    const isMenuTag = t.className === 'header-tag-button';
    if (!isMenuTag) return;

    paginationPosition = 0;
    const option = t.textContent;
    hidePostPageForm();
    displayArticlesPage(option);
  }

  function displayArticlesPage(option) {
    if (option === 'Последние') filter = null;
    else filter = { tags: [option] };
    displayArticleList();
  }

  function filterArticesHandler() {
    const form = heyId('filter-form');
    filter = {};

    const author = form.author.value;
    const isFiltByAuthor = author !== 'Все';
    if (isFiltByAuthor) filter.author = author;

    const tags = getFilterTags();
    if (tags) filter.tags = tags;

    filter = Object.assign(filter, getFilterDate());

    paginationPosition = 0;
    displayArticleList();
  }

  function getFilterTags() {
    const tags = [];
    const form = heyId('filter-form');
    const forEach = Array.prototype.forEach;
    const labels = form.querySelectorAll('label');

    forEach.call(labels, (label) => {
      const isChecked = label.querySelector('input').checked;
      const tag = label.textContent;
      if (isChecked) tags.push(tag);
    });

    if (tags.length === 0) return null;
    return tags;
  }

  function getFilterDate() {
    const form = heyId('filter-form');
    const res = {};
    const dateFrom = new Date(form.dateFrom.value);
    if (dateFrom.toString() !== 'Invalid Date') {
      res.dateFrom = dateFrom.getTime();
    }
    const dateTo = new Date(form.dateTo.value);
    if (dateTo.toString() !== 'Invalid Date') {
      res.dateTo = dateTo.getTime();
    }

    return res;
  }

  function paginationClickHandler(event) {
    const t = event.target;
    if (Number(t.textContent)) {
      paginationPosition = Number(t.textContent) - 1;
    } else if (t.id === 'prev-page') {
      paginationPosition--;
    } else if (t.id === 'next-page') {
      paginationPosition++;
    }

    displayArticleList();
  }

  function displayArticleList() {
    const options = Object.assign({}, filter);
    options.skip = ARTICLES_AMOUNT * paginationPosition;
    options.amount = ARTICLES_AMOUNT;

    requests.getArticles(options)
      .then(showPaginationPage, messageService.showErrorForm);

    window.scrollTo(0, 0);
    heyId('article-list-page-loader').style.display = 'block';
    heyId('article-list-container').innerHTML = '';
  }

  function showPaginationPage(res) {
    showArticleList(res.articles);
    paginationPagesAmount = Math.ceil(res.amount / ARTICLES_AMOUNT);
    addPagination(paginationPagesAmount);
    activatePaginationButton(paginationPosition, paginationPagesAmount - 1);
    heyId('article-list-page-loader').style.display = 'none';
  }

  function addPagination(amount) {
    if (amount <= 1) {
      heyId('pagination').style.display = 'none';
      return;
    }
    let html = '';
    for (let i = 0; i < amount; i++) {
      html += `<span>${i + 1}</span>`;
    }
    heyQuery('#pagination .pages').innerHTML = html;
    heyId('pagination').style.display = 'flex';
  }

  function activatePaginationButton(number, max) {
    queryAll('#pagination .pages .active').className = '';
    if (max === 0) return;
    queryAll('#pagination .pages span')[number].className = 'active';

    heyId('prev-page').style.display = number === 0 ? 'none' : 'block';
    heyId('next-page').style.display = number === max ? 'none' : 'block';
  }

  heyId('main-menu').addEventListener('click', tagClickHandler);
  heyId('filter-form-button-ok').addEventListener('click', filterArticesHandler);
  heyId('pagination').addEventListener('click', paginationClickHandler);

  displayArticleList();

  return {
    displayArticleList,
  };
}());
