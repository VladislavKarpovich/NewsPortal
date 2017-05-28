const Articles = require('../models/Article').Articles;
const config = require('../config');

const MAX_DATE = 8640000000000000;

function getArticles(req, res) {
  const opt = parseQuery(req.query);

  Articles.find(opt.filter)
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) return res.status(500).end();

      const articles = result.slice(opt.skip, opt.skip + opt.amount)
        .map(a => a.getArticlePreview());

      const amount = result.length;
      return res.status(200).json({ amount, articles });
    });
}

function getAuthors(req, res) {
  Articles.find().exec((err, result) => {
    if (err) return res.status(500).end();

    const obj = {};
    result.forEach(a => obj[a.author] = true);
    const authors = Object.keys(obj);
    return res.status(200).json(authors);
  });
}

function parseQuery(q) {
  const skip = Number(q.skip) || 0;
  const amount = Number(q.amount) || config.get('viewArticlesDefaultAmount');
  const filter = parseFilter(q);

  return { skip, amount, filter };
}

function parseFilter(q) {
  const filter = {
    createdAt: {
      $gte: Number(q.dateFrom) || 0,
      $lte: Number(q.dateTo) || MAX_DATE
    }
  };

  if (q.author) {
    filter.author = q.author;
  }

  if (q.tags) {
    filter.tags = { $all: q.tags.split(',') };
  }

  return filter;
}

function findById(req, res, next) {
  const id = req.params.id;
  Articles.findById(id, (err, article) => {
    if (err) return res.status(500).end();
    if (!article) return res.status(404).end();
    return res.status(200).json(article);
  });
}

function addArticle(req, res) {
  if (!req.body) {
    res.status(400).end();
    return;
  }

  const article = req.body;
  article.createdAt = Date.now();
  new Articles(article).save((err) => {
    if (err) return res.status(400).end();
    return res.status(200).end();
  });
}

function editArticle(req, res) {
  if (!req.body) {
    res.status(400).end();
    return;
  }

  const article = req.body;
  const id = req.params.id;
  Articles.findOneAndUpdate(id, article, (err, result) => {
    if (err) return res.status(500).end();
    return res.status(200).json(result);
  });
}

function deleteElement(req, res) {
  const id = req.params.id;
  Articles.findByIdAndRemove(id, (err) => {
    if (err) return res.status(500).json(err);
    return res.status(200).end();
  });
}

module.exports = {
  getArticles,
  getAuthors,
  findById,
  addArticle,
  editArticle,
  deleteElement,
};
