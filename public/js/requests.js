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
      req.open('GET', `/articles/filter?${convertToQuery(options)}`);

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

      req.open('GET', `/articles/${id}`);
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
      req.open('POST', '/articles');
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
      req.open('PUT', `/articles/${id}`);
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
      req.open('DELETE', `articles/${id}`);
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
      req.open('GET', `/articles/side?url=${url}`);
      req.send();
    });
  }

  function getUser() {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      function loadHandler() {
        req.removeEventListener('load', loadHandler);

        if (req.status === 200) {
          const rt = this.responseText;
          const res = rt ? JSON.parse(rt) : null;
          resolve(res);
          return;
        }

        reject(req.status);
      }

      req.addEventListener('load', loadHandler);
      req.open('GET', '/user');

      req.send();
    });
  }

  function login(user) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      function loadHandler() {
        req.removeEventListener('load', loadHandler);

        const res = JSON.parse(this.responseText);
        if (res.user) {
          resolve(user);
          return;
        }
        reject(res.err || { message: 'Ошибка входа.' });
      }

      req.open('POST', '/login');
      req.setRequestHeader('content-type', 'application/json');
      req.addEventListener('load', loadHandler);

      const body = JSON.stringify(user);

      req.send(body);
    });
  }

  function logout() {
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
      req.open('DELETE', '/logout');

      req.send();
    });
  }

  return {
    getArticles,
    getArticle,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticleFormMeduza,
    getUser,
    login,
    logout,
  };
}());
