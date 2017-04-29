const config = require('./config');
const db = require('diskdb');

db.connect(config.get('dataBaseFolder'));
db.loadCollections(['articles', 'sessions', 'users']);

function GetArticleDB() {
  return db.articles;
}

function GetSessionsDB() {
  return db.sessions;
}

function GetUsersDB() {
  return db.users;
}

module.exports = {
  GetArticleDB,
  GetSessionsDB,
  GetUsersDB
};
