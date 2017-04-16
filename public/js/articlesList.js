const articleList = (function () {
  const ARTICLES_AMOUNT = 5;
  const TAGS = ['Разработка', 'Администрирование', 'Дизайн', 'Управление', 'Маркетинг'];
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
    requests.getArticles({ skip: 0, amount: 12 }, (status, articles) => {
      const container = heyQuery('.last-article-list');
      displayArticles(container, articles);
    });

    for (let i = 0; i < CONTAINER_CLASSES.length; i++) {
      const options = { skip: 0, amount: 5, tags: [TAGS[i]] };
      requests.getArticles(options, (status, articles) => {
        const container = heyQuery(CONTAINER_CLASSES[i]);
        displayArticles(container, articles);
      });
    }

    showMainPage();
    activateHeaderButton('Главная');
    heyId('message-overlay').style.display = 'none';
    hidePostPageForm();
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
    const temp = heyQuery('#template-article-item').content;
    temp.querySelector('article').id = article._id;
    temp.querySelector('.post-image').src = article.images[0];
    temp.querySelector('h2').textContent = article.title;
    temp.querySelector('p').textContent = article.shortDescription;
    temp.querySelector('.author-name').textContent = article.author;
    temp.querySelector('.publication-date').textContent = convDate(article.createdAt);
    temp.querySelector('.post-tags').textContent = '';
    article.tags.forEach((item) => {
      temp.querySelector('.post-tags').textContent += ` ${item}`;
    });
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
    if (button) {
      deactivateHeaderButtons();
      button.style.color = '#FFF';
    }
  }

  function findHeaderButton(buttonText) {
    const buttons = queryAll('.nav-buttons button');
    return [].find.call(buttons, item => item.textContent === buttonText);
  }

  function deactivateHeaderButtons() {
    const buttons = queryAll('.nav-buttons button');
    [].forEach.call(buttons, (item) => {
      item.style.color = '#80CBC4';
    });
  }

  function hidePostPageForm() {
    heyId('overlay').style.display = 'none';
    heyId('post-page').style.display = 'none';
    document.body.style.overflowY = '';
  }


  function tagClickHandler(event) {
    if (event.target.tagName !== 'H1' && event.target.className !== 'header-tag-button') {
      return;
    }

    paginationPosition = 0;
    const option = event.target.textContent.split(' ')[0];
    activateHeaderButton(option);

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
    const tags = [];
    filter = {};
    [].forEach.call(form.querySelectorAll('label'), (item) => {
      if (item.querySelector('input').checked) {
        tags.push(item.textContent);
      }
    });
    if (tags.length > 0) {
      filter.tags = tags;
    }
    if (form.author.value !== 'Все') {
      filter.author = form.author.value;
    }
    let date = new Date(form.dateFrom.value);
    if (date.toString() !== 'Invalid Date') {
      filter.dateFrom = date;
    }
    date = new Date(form.dateTo.value);
    if (date.toString() !== 'Invalid Date') {
      filter.dateTo = date;
    }

    paginationPosition = 0;
    displayArticleList();
  }

  function paginationClickHandler(event) {
    if (Number(event.target.textContent)) {
      paginationPosition = Number(event.target.textContent) - 1;
      displayArticleList();
    } else if (event.target.id === 'prev-page') {
      paginationPosition--;
      displayArticleList();
    } else if (event.target.id === 'next-page') {
        paginationPosition++;
        displayArticleList();
      }
  }

  function displayArticleList() {
    const options = Object.assign({}, filter);
    options.skip = ARTICLES_AMOUNT * paginationPosition;
    options.amount = ARTICLES_AMOUNT;

    requests.getArticles(options, (status, articles, amount) => {
      showArticleList(articles);
      paginationPagesAmount = Math.ceil(amount / ARTICLES_AMOUNT);

      addPagination(paginationPagesAmount);
      activatePaginationButton(paginationPosition, paginationPagesAmount - 1);
    });
    window.scrollTo(0, 0);
  }

  function addPagination(amount) {
    if (amount > 1) {
      let html = '';
      for (let i = 0; i < amount; i++) {
        html += `<a>${i + 1}</a>`;
      }
      heyQuery('#pagination .pages').innerHTML = html;
      heyId('pagination').style.display = 'block';
    } else {
      heyId('pagination').style.display = 'none';
    }
  }

  function activatePaginationButton(number, max) {
    queryAll('#pagination .pages .active').className = '';
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

  heyId('header-menu').addEventListener('click', tagClickHandler);
  heyId('main-page').addEventListener('click', tagClickHandler);
  heyId('filter-form-button-ok').addEventListener('click', filterArticesHandler);
  heyId('message-form-ok-button').addEventListener('click', displayMainPage);
  heyId('pagination').addEventListener('click', paginationClickHandler);

  displayMainPage();

  return {
    displayMainPage,
  };
}());
