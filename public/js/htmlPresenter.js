;
var htmlPresenter = (function () {

  function convertToHTML(article) {
    var template = document.querySelector('#template-article-item');
    template.content.querySelector('article').id = article._id;
    template.content.querySelector('.post-image').src = article.images[0];
    template.content.querySelector('h2').textContent = article.title;
    template.content.querySelector('p').textContent = article.shortDescription;
    template.content.querySelector('.author-name').textContent = article.author;
    template.content.querySelector('.publication-date').textContent = converttDateToString(article.createdAt);
    template.content.querySelector('.post-tags').textContent = '';
    article.tags.forEach(function (item) {
      template.content.querySelector('.post-tags').textContent += ' ' + item;
    });
    return template.content.querySelector('article').cloneNode(true);
  }

  function converttDateToString(date) {
    return date.getUTCFullYear() + '/' +
      ('0' + (date.getUTCMonth() + 1)).slice(-2) + '/' +
      ('0' + date.getUTCDate()).slice(-2) + ' ' +
      ('0' + date.getUTCHours()).slice(-2) + ':' +
      ('0' + date.getUTCMinutes()).slice(-2);
  }

  function displayArticles(container, articles) {
    if (container) {
      container.innerHTML = '';
      if (articles) {
        articles.forEach(function (item) {
          var html = convertToHTML(item)
          container.appendChild(html);
        });
      }
    }
  }

  function displayArticleList(articles) {
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('article-list-page').style.display = 'block';
    document.getElementById('post-page').style.display = 'none';
    var container = document.getElementsByClassName('article-list')[0];
    displayArticles(container, articles);
  }

  function addArticle(article) {
    var container = document.getElementsByClassName('article-list')[0];
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

  function displayMainPage() {
    document.getElementById('main-page').style.display = 'block';
    document.getElementById('article-list-page').style.display = 'none';
    document.getElementById('post-page').style.display = 'none';
  }

  function displayAddPostPage(user, id) {
    var container = document.getElementById('post-page');
    var form = document.getElementById('edit-form');

    form.postName.value = "";
    form.shortDiscription.textContent = "";
    form.text.value = "";
    document.getElementById('edit-form-images-container').innerHTML = '';

    container.querySelector('.article-detail-view').id = id;
    container.querySelector('h1').textContent = "";
    document.querySelector('#post-page .image-container').style.display = 'none';
    document.getElementById('slides-container').innerHTML = '';
    document.getElementById('dots-container').innerHTML = '';
    container.querySelector('h6').textContent = "";
    container.querySelector('p').textContent = "";
    container.querySelector('#post-page .author-name').textContent = user.mail;
    container.querySelector('.publication-date').textContent = converttDateToString(new Date());
    document.querySelector('#post-page .post-tags').textContent = '';

    document.getElementById('main-page').style.display = 'none';
    document.getElementById('article-list-page').style.display = 'none';
    document.getElementById('post-page').style.display = 'block';
  }

  function displayPostPageForm(article) {
    var container = document.getElementById('post-page');
    var form = document.getElementById('edit-form');

    container.querySelector('h1').textContent = article ? article.title : 'title';
    form.postName.value = article ? article.title : '';

    container.querySelector('h6').textContent = article ? article.shortDescription : 'description';
    form.shortDiscription.value = article ? article.shortDescription : '';

    document.querySelector('#post-page .image-container').style.display = 'block';

    initDetailViewImages(article ? article.images : ['../img/image-template.png']);

    container.querySelector('p').textContent = article ? article.text : 'text';
    form.text.value = article ? article.text : '';
    container.querySelector('.author-name').textContent = article ? article.author : '';

    var date = article ? converttDateToString(article.createdAt) : converttDateToString(new Date());
    container.querySelector('.publication-date').textContent = date;

    initDetailViewTags(article ? article.tags : []);

    document.getElementById('post-page').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    document.body.style.overflowY = 'hidden';
  }

  function hidePostPageForm() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('post-page').style.display = 'none';
    document.body.style.overflowY = '';
  }

  function initDetailViewImages(images) {
    if (images.length) {
      var slidesHtml = '';
      var dotsHtml = '';
      document.getElementById('edit-form-images-container').innerHTML = '';
      for (var i = 0; i < images.length; i++) {
        slidesHtml += '<div class="slides fade"><img src="' + images[i] + '"></div>';
        dotsHtml += '<span class="dot">' + (i + 1) + '</span>';

        addDetailViewFormImageBlock(images[i], i);
      }
      document.getElementById('slides-container').innerHTML = slidesHtml;
      document.getElementById('dots-container').innerHTML = dotsHtml;

      document.querySelector('#post-page .image-container').style.display = 'block';
      document.getElementById('dots-container').style.display = 'block';
    } else {
      document.querySelector('#post-page .image-container').style.display = 'none';
      document.getElementById('dots-container').style.display = 'none';
    }
  }

  function addDetailViewFormImageBlock(image, i) {
    var template = document.getElementById('template-detail-view-image');
    var id = 'image-edit-form-container-' + new Date().getTime() + (i ? i : "");
    template.content.querySelector('div').id = id;
    template.content.querySelector('input').value = (image) ? image : "";
    document.getElementById('edit-form-images-container').appendChild(template.content.querySelector('div').cloneNode(true));
    return id;
  }

  function initDetailViewTags(tags) {
    var tagsHtml = '';
    var tagsCheckBoxes = document.querySelectorAll('.edit-form-tags input');
    Array.prototype.forEach.call(tagsCheckBoxes, item => item.checked = false);
    tags.forEach(function (item) {
      tagsHtml += ' ' + item;
      switch (item) {
        case 'Разработка':
          tagsCheckBoxes[0].checked = true;
          break;
        case 'Администрирование':
          tagsCheckBoxes[1].checked = true;
          break;
        case 'Дизайн':
          tagsCheckBoxes[2].checked = true;
          break;
        case 'Управление':
          tagsCheckBoxes[3].checked = true;
          break;
        case 'Маркетинг':
          tagsCheckBoxes[4].checked = true;
          break;
        default:
      }
    });
    document.querySelector('#post-page .post-tags').textContent = tagsHtml;
  }

  function showLoginForm() {
    document.getElementById('log-in-form').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  }

  function hideLoginForm() {
    document.getElementById('log-in-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }

  function showErrorForm(content, title) {
    var form = document.getElementById('error-form');
    if (content) {
      form.querySelector('p').textContent = content;
    }
    if (title) {
      form.querySelector('h1').textContent = title;
    }
    document.getElementById('message-overlay').style.display = 'block';
    form.style.display = 'block';
  }

  function hideErrorForm() {
    document.getElementById('error-form').style.display = 'none';
    document.getElementById('message-overlay').style.display = 'none';
  }

  function showExclamationForm(content, title) {
    var form = document.getElementById('exclamation-form');
    if (content) {
      form.querySelector('p').textContent = content;
    }
    if (title) {
      form.querySelector('h1').textContent = title;
    }
    document.getElementById('message-overlay').style.display = 'block';
    form.style.display = 'block';
  }

  function hideExclamationForm() {
    document.getElementById('exclamation-form').style.display = 'none';
    document.getElementById('message-overlay').style.display = 'none';
  }

  function showMessageForm(content, title) {
    var form = document.getElementById('message-form');
    if (content) {
      form.querySelector('p').textContent = content;
    }
    if (title) {
      form.querySelector('h1').textContent = title;
    }
    document.getElementById('message-overlay').style.display = 'block';
    form.style.display = 'block';
  }

  function hideMessageForm() {
    document.getElementById('message-form').style.display = 'none';
    document.getElementById('message-overlay').style.display = 'none';
  }

  function userIn(user) {
    var articlesButtons = document.getElementsByClassName('article-item-buttons');
    for (var i = 0; i < articlesButtons.length; i++) {
      articlesButtons[i].style.display = 'block';
    }
    document.getElementById('edit-form').className = '';
    if (user) {
      var userPanel = document.getElementById('header-user-panel');
      userPanel.className = 'header-user-panel';
      if (user.name) {
        userPanel.querySelector('h1').textContent = user.name;
      }
      else {
        userPanel.querySelector('h1').textContent = 'User Name';
      }
      if (user.mail) {
        userPanel.querySelector('p').textContent = user.mail;
      }
      else {
        userPanel.querySelector('p').textContent = 'usermail@mail.com';
      }
      if (user.image) {
        userPanel.querySelector('img').src = user.image;
      }
      else {
        userPanel.querySelector('img').src = 'img/user-icon.png';
      }
    }
  }

  function userOut() {
    var articlesButtons = document.getElementsByClassName('article-item-buttons');
    for (var i = 0; i < articlesButtons.length; i++) {
      articlesButtons[i].style.display = 'none';
    }
    var template = document.getElementById('template-article-item');
    document.getElementById('header-user-panel').className = 'display-none';
    document.getElementById('edit-form').className = 'display-none';
  }

  function deactivateHeaderButtons() {
    var buttons = document.querySelectorAll('.nav-buttons button');
    [].forEach.call(buttons, function (item) {
      item.style.color = '#80CBC4';
    });
  }

  function activateHeaderButton(buttonText) {
    var button = findHeaderButton(buttonText);
    if (button) {
      deactivateHeaderButtons();
      button.style.color = '#FFF';
    }
  }

  function findHeaderButton(buttonText) {
    var buttons = document.querySelectorAll('.nav-buttons button');
    return [].find.call(buttons, function (item) {
      return item.textContent === buttonText;
    });
  }

  function addAuthorsInFilter(author) {
    var container = document.getElementById('filter-autors');
    container.innerHTML = '<option>Все</option>';
    author.forEach(function (item) {
      container.innerHTML += '<option>' + item + '</option>';
    });
  }

  function addPagination(amount) {
    if (amount > 1) {
      var html = '';
      for (var i = 0; i < amount; i++) {
        html += '<a>' + (i + 1) + '</a>';
      }
      document.querySelector('#pagination .pages').innerHTML = html;
      document.getElementById('pagination').style.display = 'block';
    } else {
      document.getElementById('pagination').style.display = 'none';
    }
  }

  function activatePaginationButton(number, max) {
    document.querySelectorAll('#pagination .pages .active').className = '';
    document.querySelectorAll('#pagination .pages a')[number].className = 'active';
    if (number === 0) {
      document.getElementById('prev-page').style.display = 'none';
    } else {
      document.getElementById('prev-page').style.display = 'block';
    }

    if (number === max) {
      document.getElementById('next-page').style.display = 'none';
    } else {
      document.getElementById('next-page').style.display = 'block';
    }
  }

  function hideOverlay() {
    document.getElementById('overlay').style.display = 'none';
  }

  function removeAllEventListeners(id) {
    var old_element = document.getElementById(id);
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
  }


  return {
    displayArticleList: displayArticleList,
    displayMainPage: displayMainPage,
    displayPostPageForm: displayPostPageForm,
    displayArticles: displayArticles,
    addDetailViewFormImageBlock: addDetailViewFormImageBlock,
    addArticle: addArticle,
    removeArticle: removeArticle,
    editArticle: editArticle,
    showLoginForm: showLoginForm,
    hideLoginForm: hideLoginForm,
    showErrorForm: showErrorForm,
    hideErrorForm: hideErrorForm,
    showExclamationForm: showExclamationForm,
    hideExclamationForm: hideExclamationForm,
    showMessageForm: showMessageForm,
    hideMessageForm: hideMessageForm,
    userIn: userIn,
    userOut: userOut,
    deactivateHeaderButtons: deactivateHeaderButtons,
    activateHeaderButton: activateHeaderButton,
    addAuthorsInFilter: addAuthorsInFilter,
    addPagination: addPagination,
    displayAddPostPage: displayAddPostPage,
    activatePaginationButton: activatePaginationButton,
    hidePostPageForm: hidePostPageForm,
    hideOverlay: hideOverlay
  }
}());