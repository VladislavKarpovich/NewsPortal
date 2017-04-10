const config = require('../config');
const db = require('diskdb');

db.connect(config.get('dataBaseFolder'));
db.loadCollections(['articles']); 

exports.getArticles = function (skip, amount, filter) {
    const articlesArray = filterArticles(filter);
    articlesArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return {
        articles: articlesArray.slice(skip, skip + amount),
        amount: articlesArray.length
    };
};

function filterArticles(filter) {
    if (!filter) {
        return db.articles.find();
    }

    return db.articles.find().filter((item) => {
        if (filter.tags) {
            for (let i = 0; i < filter.tags.length; i++) {
                if (item.tags.indexOf(filter.tags[i]) === -1) { return false; }
            }
        }
        if (filter.author) {
            if (item.author !== filter.author) { return false; }
        }
        if (filter.dateFrom && filter.dateFrom.toString() !== 'Invalid Date') {
            if (filter.dateFrom > item.createdAt) { return false; }
        }
        if (filter.dateTo && filter.dateTo.toString() !== 'Invalid Date') {
            if (filter.dateTo < item.createdAt) { return false; }
        }
        return true;
    });
}

exports.getArticleById = function getArticle(id) {
    return db.articles.findOne({ _id: id });
};

exports.removeArticle = function (id) {
    return db.articles.remove({ _id: id });
};

exports.addArticle = function (article) {
    return db.articles.save(article);
};

exports.editArticle = function (id, article) {
    return db.articles.update({ _id: id }, article, { multi: false, upsert: false });
};
