const mongoose = require('../libs/mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  title: String,
  shortDescription: String,
  text: String,
  author: { type: String, index: true },
  createdAt: Number,
  tags: { type: [String], index: true },
  images: [String]
});

function getArticlePreview() {
  const articlePreview = {
    title: this.title,
    shortDescription: this.shortDescription,
    img: this.images[0],
    author: this.author,
    createdAt: this.createdAt,
    tags: this.tags,
    _id: this._id
  };

  return articlePreview;
}

schema.methods = {
  getArticlePreview
};

exports.Articles = mongoose.model('Articles', schema);
