const articlesModel = require('../models/articles');
const log = require('winston');
const config = require('../config');

exports.getArticles = function (req, res) {
    var filter = {
        tags: req.query.tags ? req.query.tags.split(',') : [],
        author: req.query.author,
        dateFrom: new Date(req.query.dateFrom),
        dateTo: new Date(req.query.dateTo)
    }
    var skip = Number(req.query.skip) || 0;
    var amount = Number(req.query.amount) || config.get('viewArticlesDefaultAmount');

    log.info(filter);
    log.info('skip: ' + skip);
    log.info('amount: ' + amount);

    res.json(articlesModel.getArticles(skip, amount, filter));
};

exports.findById = function (req, res) {
    res.send(200, articlesModel.getArticleById(req.params.id));
};

exports.addArticle = function (req, res) {
    articlesModel.addArticle(req.body);
    res.send(200);
};

exports.editArticle = function (req, res) {
    var result = articlesModel.editArticle(req.params.id, req.body);
    if(result.updated === 1) {
        res.sendStatus(200);
    } else {
        res.sendStatus(204);
    }
};

exports.deleteElement = function (req, res) {
    articlesModel.removeArticle(req.params.id)
    res.sendStatus(200);
};