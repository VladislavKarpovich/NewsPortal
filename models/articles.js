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
  const ids = articlesIndexes.filterArticlesIds(filter);
  let articles = ids ? ids.map(id => db.findOne({ _id: id })) : db.find();
  articles = dateFilter(filter.dateFrom, filter.dateTo, articles);
  articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return {
    articles: articles.slice(skip, skip + amount),
    amount: articles.length,
  };
}

function getArticleById(id) {
  return db.findOne({ _id: id });
}

function removeArticle(id) {
  const article = db.articles.remove({ _id: id });
  articlesIndexes.deleteArticleIds(article);
  return db.remove({ _id: id });
}

function addArticle(article) {
  const savedArticle = db.save(article);
  articlesIndexes.createArticleIds(article);
}

function editArticle(id, article) {
  const oldArticle = db.findOne({ _id: id });
  articlesIndexes.updateArticleIds(oldArticle, article);
  const updateOptions = { multi: false, upsert: false };
  return db.update({ _id: id }, article, updateOptions);
}

module.exports = {
  getArticles,
  getArticleById,
  removeArticle,
  addArticle,
  editArticle,
};
