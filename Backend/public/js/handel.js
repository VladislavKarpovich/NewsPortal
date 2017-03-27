;
var handels = (function () {
  function userIn() {
    var loginForm = document.getElementById('log-in-form');
    if(loginForm.login.value !== '' ) {
      htmlController.userIn({ mail: loginForm.login.value });
      document.getElementById('log-in-button').removeEventListener('click', htmlController.showLoginForm);
    }
    htmlController.hideLoginForm();
  }

  function userOut() {
    htmlController.userOut();
    document.getElementById('login-form-button').addEventListener('click', userIn);
    document.getElementById('log-in-button').addEventListener('click', htmlController.showLoginForm);
  }

  function tagClickHandel(event) {
    var articles;
    if ((event.target.tagName.toLowerCase() === 'h1') ||
      (event.target.tagName.toLowerCase() === 'button')) {
      var tag = tags.find(function (item) {
        return item === event.target.textContent;
      });
      if (event.target.textContent.split(' ')[0] === 'Последние') {
         articleListControoler.dispalyArticleList();
      }
      if (event.target.textContent === 'Главная') {
        articleListControoler.displayMainPage();
      }
      if (tag) {
        articleListControoler.dispalyArticleList({ tags: [tag] });
      }
      htmlController.activateHeaderButton(event.target.textContent.split(' ')[0]);
      window.scrollTo(0, 0);
      addArticlesClickEventListener();
    }
  }

  function showArticleDetailView(event) {
    article = articlesPresenter.getArticle(this.id);
    htmlController.displayPostPage(article);
    htmlController.deactivateHeaderButtons();
    window.scrollTo(0, 0);
  }

  function addArticlesClickEventListener() {
    [].forEach.call(document.getElementsByTagName('article'), function (item) {
      item.addEventListener('click', showArticleDetailView);
    });
  }

  function getFilter() {
    var form = document.getElementById('filter-form');
    var filter = {};
    var tags = [];
    [].forEach.call(form.querySelectorAll('label'), function(item) {
      if(item.querySelector('input').checked) {
        tags.push(item.textContent);
      }
    });
    if(tags.length > 0) {
      filter.tags = tags;
    }
    if(form.author.value !== 'Все') {
      console.log( form.author);
      filter.author = form.author.value;
    }
    var date = new Date(form.dateFrom.value);
    if(date != 'Invalid Date') {
      filter.dateFrom = date;
    }
    date = new Date(form.dateTo.value);
    if(date != 'Invalid Date') {
      filter.dateTo = date;
    }

    return filter;
  }

  function filterArtices(event) {
    var filter = getFilter();
    console.log(filter);
    articleListControoler.dispalyArticleList(filter);
    addArticlesClickEventListener();
  }

  return {
    tagClickHandel:  tagClickHandel,
    userIn: userIn,
    userOut: userOut,
    showArticleDetailView: showArticleDetailView,
    addArticlesClickEventListener: addArticlesClickEventListener,
    filterArtices: filterArtices
  }
}());