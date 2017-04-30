const articlesModel = require('../models/articles');
const config = require('../config');

function parseQuery(query) {
  return {
    skip: Number(query.skip) || 0,
    amount: Number(query.amount) || config.get('viewArticlesDefaultAmount'),
    filter: {
      tags: query.tags ? query.tags.split(',') : [],
      author: query.author,
      dateFrom: new Date(query.dateFrom),
      dateTo: new Date(query.dateTo),
    },
  };
}

function getArticles(req, res) {
  const q = parseQuery(req.query);
  articlesModel.getArticles(q.skip, q.amount, q.filter).then(
    answer => res.status(200).send(answer),
    () => res.sendStatus(404)
  );
}

function findById(req, res) {
  articlesModel.getArticleById(req.params.id).then(
     artile => res.status(200).send(artile),
     () => res.sendStatus(404)
   );
}

function addArticle(req, res) {
  articlesModel.addArticle(req.body).then(
    () => res.sendStatus(200),
    () => res.sendStatus(400)
  );
}

function editArticle(req, res) {
  articlesModel.editArticle(req.params.id, req.body).then(
    () => res.sendStatus(200),
    () => res.sendStatus(204)
  );
}

function deleteElement(req, res) {
  articlesModel.removeArticle(req.params.id).then(
    () => res.sendStatus(200),
    () => res.sendStatus(400)
  );
}

module.exports = {
  getArticles,
  findById,
  addArticle,
  editArticle,
  deleteElement,
};
