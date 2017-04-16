const config = require('./config');
const db = require('diskdb');

db.connect(config.get('dataBaseFolder'));
db.loadCollections(['articles']);

function GetArticleDB() {
  return db.articles;
}

module.exports = {
  GetArticleDB,
};
