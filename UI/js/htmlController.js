;
var htmlController = (function () {
  function convertToHTML(article) {
    var template = document.querySelector('#template-article-item');
    template.content.querySelector('article').id = article.id;
    template.content.querySelector('.post-image').src = article.images[0];
    template.content.querySelector('h2').textContent = article.title;
    template.content.querySelector('p').textContent = article.shortDescription;
    template.content.querySelector('.author-name').textContent = article.author;
    template.content.querySelector('.publication-date').textContent = converttDateToString(article.createdAt);
    template.content.querySelector('.post-tags').textContent = "";
    article.tags.forEach(function (item) {
      template.content.querySelector('.post-tags').textContent += " " + item;
    });
    return template.content.querySelector('article').cloneNode(true);
  }

  function converttDateToString(date) {
    return date.getUTCFullYear() + "/" +
      ("0" + (date.getUTCMonth() + 1)).slice(-2) + "/" +
      ("0" + date.getUTCDate()).slice(-2) + " " +
      ("0" + date.getUTCHours()).slice(-2) + ":" +
      ("0" + date.getUTCMinutes()).slice(-2) + ":";
  }

  function displayArticles(container, articles) {
    if (container) {
      container.innerHTML = '';
      if (articles) {
        articles.forEach(function (item) {
          var html = convertToHTML(item)
          container.appendChild(html);
          console.log(html);
        });
      }
    }
  }

  function displayArticleList(articles) {
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('article-list-page').style.display = 'block';
    var container = document.getElementsByClassName("article-list")[0];
    displayArticles(container, articles);
  }

  function addArticle(article) {
    var container = document.getElementsByClassName("article-list")[0];
    container.firstChild
    if (article) {
      var html = convertToHTML(article);
      container.insertBefore(html, container.firstChild);
      console.log(html);
    }
  }

  function removeArticle(id) {
    var article = document.getElementById(id);
    if (article) {
      article.parentNode.removeChild(article);
    }
    console.log(article);
  }

  function editArticle(id, article) {
    if (id) {
      var oldArticle = document.getElementById(id);
      article = convertToHTML(article);
      if (article && oldArticle) {
        oldArticle.innerHTML = article.innerHTML;
      }
      console.log(oldArticle);
    }
  }

  function displayMainPage(lastArticles, developmentArticles, administrationArticles,
    designArticles, managementArticles, marketingArticles) {
    var container = document.getElementsByClassName('last-article-list')[0];
    displayArticles(container, lastArticles);

    container = document.getElementsByClassName('development-article-list')[0];
    displayArticles(container, developmentArticles);

    container = document.getElementsByClassName('administration-article-list')[0];
    displayArticles(container, administrationArticles);

    container = document.getElementsByClassName('design-article-list')[0];
    displayArticles(container, designArticles);

    container = document.getElementsByClassName('management-article-list')[0];
    displayArticles(container, managementArticles);

    container = document.getElementsByClassName('marketing-article-list')[0];
    displayArticles(container, marketingArticles);

    document.getElementById('main-page').style.display = 'block';
    document.getElementById('article-list-page').style.display = 'none';
  }

  function showFilterForm() {
    document.getElementById('filter-form').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  }

  function hideFilterForm() {
    document.getElementById('filter-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }

  function showLoginForm() {
    document.getElementById('log-in-form').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  }

  function hideLoginForm() {
    document.getElementById('log-in-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }

  function userIn(user) {
    if (user) {
      var articlesButtons = document.getElementsByClassName('article-item-buttons');
      for (var i = 0; i < articlesButtons.length; i++) {
        articlesButtons[i].style.display = 'block';
      }
      var template = document.getElementById("template-article-item");
      (template.content.querySelector('.article-item-buttons')).className = 'article-item-buttons';
      var userPanel = document.getElementById("header-user-panel");
      userPanel.className = "header-user-panel";
      if(user.name) {
        userPanel.querySelector('h1').textContent = user.name;
      }
      else {
         userPanel.querySelector('h1').textContent = "User Name";
      }
      if(user.mail) {
        userPanel.querySelector('p').textContent = user.mail;
      }
      else {
        userPanel.querySelector('p').textContent = "usermail@mail.com";
      }
      if(user.image) {
        userPanel.querySelector('img').src = user.image;
      }
      else{
        userPanel.querySelector('img').src = "img/user-icon.png";
      }
    }
  }

  function userOut() {
    var articlesButtons = document.getElementsByClassName('article-item-buttons');
    for (var i = 0; i < articlesButtons.length; i++) {
      articlesButtons[i].style.display = 'none';
    }
    var template = document.getElementById("template-article-item");
    (template.content.querySelector('.article-item-buttons')).className += ' display-none';
    var userPanel = document.getElementById("header-user-panel");
    userPanel.className = "display-none";
  }

  return {
    displayArticleList: displayArticleList,
    displayMainPage: displayMainPage,
    addArticle: addArticle,
    removeArticle: removeArticle,
    editArticle: editArticle,
    showFilterForm: showFilterForm,
    hideFilterForm: hideFilterForm,
    showLoginForm: showLoginForm,
    hideLoginForm: hideLoginForm,
    userIn: userIn,
    userOut: userOut
  }
}());