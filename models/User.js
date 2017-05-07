const crypto = require('crypto');
const mongoose = require('../libs/mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  username: { type: String, unique: true, required: true, index: true },
  mail: { type: String },
  img: { type: String },
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
});

schema.methods.encryptPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    this.salt = Math.random().toString();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () { return this._plainPassword; });


schema.methods.checkPassword = function (password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

exports.User = mongoose.model('User', schema);
