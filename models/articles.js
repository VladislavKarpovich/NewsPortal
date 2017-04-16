const config = require('../config');
const db = require('../db').GetArticleDB();
const articlesIndexes = require('../dataAccessLevel');

(function () {
  const articles = db.find();
  articlesIndexes.init(articles);
}());

function dateFilter(dateFrom, dateTo, articles) {
  if ((!dateFrom || dateFrom == 'Invalid Date') &&
    (!dateTo || dateTo == 'Invalid Date')) return articles;

  return articles.filter((article) => {
    const createdAt = new Date(article.createdAt);

    if ((dateFrom && dateFrom != 'Invalid Date') &&
      (dateFrom > createdAt)) return false;

    if ((dateTo && dateTo != 'Invalid Date') &&
      (dateTo < createdAt)) return false;

    return true;
  });
}

function getArticles(skip, amount, filter) {
  return new Promise((resolve, reject) => {
    const ids = articlesIndexes.filterArticlesIds(filter);
    let articles = ids ? ids.map(id => db.findOne({ _id: id })) : db.find();
    articles = dateFilter(filter.dateFrom, filter.dateTo, articles);
    articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (articles) {
      const answer = {
        articles: articles.slice(skip, skip + amount),
        amount: articles.length,
      };
      resolve(answer);
      return;
    }
    reject();
  });
}

function getArticleById(id) {
  return new Promise((resolve, reject) => {
    const answer = db.findOne({ _id: id });
    if (answer) {
      resolve(answer);
      return;
    }
    reject();
  });
}

function removeArticle(id) {
  return new Promise((resolve, reject) => {
    const article = db.remove({ _id: id });
    articlesIndexes.deleteArticleIds(article);
    resolve();
  });
}

function addArticle(article) {
  return new Promise((resolve, reject) => {
    const savedArticle = db.save(article);
    articlesIndexes.createArticleIds(article);
    resolve();
  });
}

function editArticle(id, article) {
  return new Promise((resolve, reject) => {
    const oldArticle = db.findOne({ _id: id });
    articlesIndexes.updateArticleIds(oldArticle, article);
    const updateOptions = { multi: false, upsert: false };
    const answer = db.update({ _id: id }, article, updateOptions);
    if (answer.updated === 1) {
      resolve();
      return;
    }

    reject();
  });
}

module.exports = {
  getArticles,
  getArticleById,
  removeArticle,
  addArticle,
  editArticle,
};
