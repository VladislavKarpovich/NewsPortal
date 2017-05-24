const articleList = (function () {
  const ARTICLES_AMOUNT = 5;
  const TAGS = [
    'Разработка',
    'Администрирование',
    'Дизайн',
    'Управление',
    'Маркетинг',
  ];
  const CONTAINER_CLASSES = [
    '.development-article-list',
    '.administration-article-list',
    '.design-article-list',
    '.management-article-list',
    '.marketing-article-list',
  ];

  let filter = {};
  let paginationPosition = 0;
  let paginationPagesAmount = 1;

  function displayMainPage() {
    addArticlesToTagContainer(null, '.last-article-list');

    const l = CONTAINER_CLASSES.length;
    for (let i = 0; i < l; i++) {
      const tag = TAGS[i];
      const containerClass = CONTAINER_CLASSES[i];
      addArticlesToTagContainer(tag, containerClass);
    }

    showMainPage();
    activateHeaderButton('Главная');
    heyId('message-overlay').style.display = 'none';
    hidePostPageForm();
  }

  function addArticlesToTagContainer(tag, contClass) {
    const options = { skip: 0, amount: 8 };
    if (tag) {
      options.tags = [tag];
      options.amount = 4;
    }

    requests.getArticles(options).then(
      (res) => {
        const container = heyQuery(contClass);
        displayArticles(container, res.articles);
      },
      status => messageService(status)
    );
  }

  function displayArticles(container, articles) {
    container.innerHTML = '';
    if (!articles) return;

    articles.forEach((item) => {
      const html = convertToHTML(item);
      container.appendChild(html);
    });
  }

  function showArticleList(articles) {
    heyId('main-page').style.display = 'none';
    heyId('article-list-page').style.display = 'block';
    heyId('post-page').style.display = 'none';
    const container = heyClassName('article-list')[0];
    displayArticles(container, articles);
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

  function showMainPage() {
    heyId('main-page').style.display = 'block';
    heyId('article-list-page').style.display = 'none';
    heyId('post-page').style.display = 'none';
  }

  function activateHeaderButton(buttonText) {
    const button = findHeaderButton(buttonText);
    if (!button) return;

    deactivateHeaderButtons();
    button.classList.add('active-button');
  }

  function findHeaderButton(buttonText) {
    const bs = queryAll('#header-menu nav button');
    const find = Array.prototype.find;
    return find.call(bs, a => a.textContent === buttonText);
  }

  function deactivateHeaderButtons() {
    const query = '#header-menu nav button.active-button';
    const bs = queryAll(query);
    const forEach = Array.prototype.forEach.call;
    forEach(bs, a => a.classList.remove('active-button'));
  }

  function hidePostPageForm() {
    heyId('overlay').style.display = 'none';
    heyId('post-page').style.display = 'none';
    document.body.style.overflowY = '';
  }

  function tagClickHandler(event) {
    const t = event.target;
    const isMenuTag = t.tagName === 'H1';
    const isPageTag = t.className === 'header-tag-button';
    if (!isMenuTag && !isPageTag) return;

    paginationPosition = 0;
    const option = t.textContent.split(' ')[0];
    activateHeaderButton(option);
    hidePostPageForm();
    displayArticlesPage();
  }

  function displayArticlesPage(option) {
    switch (option) {
      case 'Главная':
        filter = null;
        displayMainPage();
        break;
      case 'Последние':
        filter = null;
        displayArticleList();
        break;
      default:
        filter = {
          tags: [option],
        };
        displayArticleList();
    }
  }

  function filterArticesHandler() {
    const form = heyId('filter-form');
    filter = {};
    filter.tags = getFilterTags();
    if (form.author.value !== 'Все') {
      filter.author = form.author.value;
    }


    paginationPosition = 0;
    displayArticleList();
  }

  function getFilterTags() {
    const tags = [];
    const form = heyId('filter-form');
    const forEach = Array.prototype.forEach.call;
    const labels = form.querySelectorAll('label');

    forEach(labels, (label) => {
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
      res.dateFrom = dateFrom;
    }
    const dateTo = new Date(form.dateTo.value);
    if (dateTo.toString() !== 'Invalid Date') {
      res.dateTo = dateTo;
    }

    return res;
  }

  function paginationClickHandler(event) {
    const t = event.target;
    if (Number(t.textContent)) {
      paginationPosition = Number(t.textContent) - 1;
      displayArticleList();
    } else if (t.id === 'prev-page') {
      paginationPosition--;
      displayArticleList();
    } else if (t.id === 'next-page') {
      paginationPosition++;
      displayArticleList();
    }
  }

  function displayArticleList() {
    const options = Object.assign({}, filter);
    options.skip = ARTICLES_AMOUNT * paginationPosition;
    options.amount = ARTICLES_AMOUNT;

    requests.getArticles(options)
      .then(showPaginationPage, messageService.showErrorForm);
    window.scrollTo(0, 0);
  }

  function showPaginationPage(res) {
    showArticleList(res.articles);
    paginationPagesAmount = Math.ceil(res.amount / ARTICLES_AMOUNT);
    addPagination(paginationPagesAmount);
    activatePaginationButton(paginationPosition, paginationPagesAmount - 1);
  }

  function addPagination(amount) {
    if (amount <= 1) {
      heyId('pagination').style.display = 'none';
      return;
    }
    let html = '';
    for (let i = 0; i < amount; i++) {
      html += `<a>${i + 1}</a>`;
    }
    heyQuery('#pagination .pages').innerHTML = html;
    heyId('pagination').style.display = 'block';
  }

  function activatePaginationButton(number, max) {
    queryAll('#pagination .pages .active').className = '';
    if (max === 0) return;
    queryAll('#pagination .pages a')[number].className = 'active';

    heyId('prev-page').style.display = number === 0 ? 'none' : 'block';
    heyId('next-page').style.display = number === max ? 'none' : 'block';
  }

  function heyId(id) {
    return document.getElementById(id);
  }

  function heyClassName(className) {
    return document.getElementsByClassName(className);
  }

  function heyQuery(query) {
    return document.querySelector(query);
  }

  function queryAll(query) {
    return document.querySelectorAll(query);
  }

  heyId('main-menu').addEventListener('click', tagClickHandler);
  heyId('main-page').addEventListener('click', tagClickHandler);
  heyId('filter-form-button-ok').addEventListener('click', filterArticesHandler);
  heyId('message-form-ok-button').addEventListener('click', displayMainPage);
  heyId('pagination').addEventListener('click', paginationClickHandler);

  displayMainPage();

  return {
    displayMainPage,
  };
}());
