const requests = (function () {
  function getArticles(options) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      function loadHandler() {
        req.removeEventListener('load', loadHandler);
        const res = JSON.parse(this.responseText);
        res.articles.forEach(item => item.createdAt = new Date(item.createdAt));

        if (req.status === 200) {
          resolve(res);
          return;
        }

        reject(req.status);
      }

      req.addEventListener('load', loadHandler);
      req.open('GET', `/articles?${convertToQuery(options)}`);

      req.send();
    });
  }

  function convertToQuery(obj) {
    const str = [];
    const keys = Object.keys(obj);

    keys.forEach((key) => {
      str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    });

    return str.join('&');
  }


  function getArticle(id) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      function loadHandler() {
        req.removeEventListener('load', loadHandler);
        const article = JSON.parse(this.responseText);
        article.createdAt = new Date(article.createdAt);

        if (req.status === 200) {
          resolve(article);
          return;
        }
        reject(req.status);
      }

      req.addEventListener('load', loadHandler);

      req.open('GET', `/article/${id}`);
      req.send();
    });
  }


  function addArticle(article) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      function loadHandler() {
        req.removeEventListener('load', loadHandler);
        if (req.status === 200) {
          resolve();
          return;
        }
        reject(req.status);
      }

      req.addEventListener('load', loadHandler);
      req.open('POST', '/article');
      req.setRequestHeader('content-type', 'application/json');
      req.send(JSON.stringify(article));
    });
  }


  function updateArticle(id, article) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      function loadHandler() {
        req.removeEventListener('load', loadHandler);
        if (req.status === 200) {
          resolve();
          return;
        }
        reject(req.status);
      }

      req.addEventListener('load', loadHandler);
      req.open('PUT', `/article/${id}`);
      req.setRequestHeader('content-type', 'application/json');
      req.send(JSON.stringify(article));
    });
  }


  function deleteArticle(id) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      function loadHandler() {
        req.removeEventListener('load', loadHandler);
        if (req.status === 200) {
          resolve();
          return;
        }
        reject(req.status);
      }

      req.addEventListener('load', loadHandler);
      req.open('DELETE', `article/${id}`);
      req.send();
    });
  }

  function getArticleFormMeduza(url) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      function loadHandler() {
        req.removeEventListener('load', loadHandler);
        const res = JSON.parse(this.responseText);
        res.createdAt = new Date(res.createdAt);
        console.log(res);
        resolve(res);
      }

      req.addEventListener('load', loadHandler);
      req.open('GET', `/articleData?url=${url}`);
      req.send();
    });
  }

  return {
    getArticles,
    getArticle,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticleFormMeduza
  };
}());
