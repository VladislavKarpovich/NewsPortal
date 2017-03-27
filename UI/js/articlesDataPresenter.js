;
var articlesPresenter = (function () {
  var tags = [
    'Разработка',
    'Администрирование',
    'Дизайн',
    'Управление',
    'Маркетинг'
  ]

var articles;

  function sortArticles(articles) {
    articles.sort(function (a, b) {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  function getArticles(skip = 0, top = 10, filter) {
    return filterArticles(filter).slice(skip, skip + top);
  }

  function filterArticles(filter) {
    var currentArticles;
    if (filter) {
      currentArticles = articles.filter(function (item) {
        if (filter.tags) {
          for (var i = 0; i < filter.tags.length; i++) {
            if (item.tags.indexOf(filter.tags[i]) === -1)
              return false;
          }
        }
        if (filter.author) {
          if (item.author !== filter.author)
            return false;
        }
        if (filter.dateFrom) {
          if (filter.dateFrom > item.createdAt)
            return false;
        }
        if (filter.dateTo) {
          if (filter.dateTo < item.createdAt)
            return false;
        }
        return true;
      });
    } else {
      currentArticles = articles;
    }
    sortArticles(currentArticles);
    return currentArticles;
  }

  function getArticle(id) {
    var res = articles.find(function (item) {
      return item.id === id
    });
    if (res)
      return res;
    else
      return null;
  }

  function hasUniqueId(article) {
    if (getArticle(article.id))
      return false;
    else
      return true;
  }

  function isValidateArticle(article) {
    if (!article)
      return false;
    if (((article.title.length > 100) || (article.title.length === 0)) &&
      ((article.title.shortDescription.length > 200)) &&
      (article.text.length === 0) && (!(article.tags) || (article.tags.length === 0))) {
      return false;
    }
    for (var i = 0; i < article.tags.length; i++) {
      if (tags.indexOf(article.tags[i]) === -1)
        return false;
    }
    if (article.images) {
      for (var i = 0; i < article.images.length; i++) {
        if (!isValidUrl(article.images[i]))
          return false;
      }
    }
    return true;
  }

  function isValidUrl(url) {
    var objRE = /(^https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i;
    return objRE.test(url);
  }

  function removeArticle(id) {
    var index = articles.findIndex(function (item) {
      return item.id === id;
    });
    if (index != -1) {
      articles.splice(index, 1);
      localStorage.setItem('articleData', JSON.stringify(articles));
      return true;
    }
    return false;
  }

  function addArticle(article) {
    if (isValidateArticle(article) && hasUniqueId(article)) {
      articles.push(article);
      localStorage.setItem('articleData', JSON.stringify(articles));
      return true;
    } else {
      return false;
    }
  }

  function editArticle(id, article) {
    var oldArticle = getArticle(id);
    var newArticle = Object.assign({}, oldArticle);
    for (var key in article) {
      if ((key !== 'id') && (key !== ' createdAt') && ((key !== 'author')))
        newArticle[key] = article[key];
    }
    if (isValidateArticle(newArticle)) {
      for (var key in article) {
        oldArticle[key] = article[key];
      }
      localStorage.setItem('articleData', JSON.stringify(articles));
      return true;
    } else {
      return false;
    }
  }

  function getAuthors() {
    var authors = [];
    if (articles) {
      var obj = {};
      articles.forEach(function (item) {
        obj[item.author] = '';
      });
      authors = Object.keys(obj);
    }
    return authors;
  }

  function setArticels(articlesArray) {
    articles = articlesArray;
  }

  return {
    sort: sortArticles,
    getArticle: getArticle,
    getArticles: getArticles,
    filterArticles: filterArticles,
    addArticle: addArticle,
    editArticle: editArticle,
    removeArticle: removeArticle,
    getAuthors: getAuthors,
    setArticels: setArticels
  }
}());