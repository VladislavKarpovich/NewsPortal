const mongoose = require('./libs/mongoose');
const async = require('async');

async.series([
  open,
  dropDatabase,
  requireModels,
  createUsers
], function (err) {
  console.log(arguments);
  mongoose.disconnect();
  process.exit(err ? 255 : 0);
});

function open(callback) {
  mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
  const db = mongoose.connection.db;
  db.dropDatabase(callback);
}

function requireModels(callback) {
  require('./models/User');

  async.each(Object.keys(mongoose.models), (modelName, callback) => {
    mongoose.models[modelName].ensureIndexes(callback);
  }, callback);
}

function createUsers(callback) {
  const users = [
    { username: 'Вася', password: '123', mail: 'mailVasya@mail.com', img: 'https://www.dreamhost.com/blog/wp-content/uploads/2015/10/DHC_blog-image-01-300x300.jpg' },
    { username: 'Петя', password: '123', mail: 'mailPetya@mail.com', img: 'http://www.gettyimages.com/gi-resources/images/Embed/new/embed2.jpg' },
    { username: 'admin', password: 'admin' }
  ];

  async.each(users, (userData, callback) => {
    const user = new mongoose.models.User(userData);
    user.save(callback);
  }, callback);
}
