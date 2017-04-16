const authorIndex = require('./authorsIndex');
const tagsIndex = require('./tagsIndex');
const tagsAndAuthorIndex = require('./tagsAndAuthorIndex');

function init(articles) {
  if (!articles || articles.length === 0) return;

  articles.forEach((item) => {
    const id = item._id;
    const author = item.author;
    const tags = item.tags;

    authorIndex.addId(id, author);
    tagsIndex.addId(id, tags);
    tagsAndAuthorIndex.addId(id, author, tags);
  });
}

function deleteArticleIds(article) {
  const id = article._id;
  const author = article.author;
  const tags = article.tags;

  authorIndex.deleteId(id, author);
  tagsIndex.deleteId(id, tags);
  tagsAndAuthorIndex.deleteId(id, author, tags);
}

function createArticleIds(article) {
  const id = article._id;
  const author = article.author;
  const tags = article.tags;

  authorIndex.addId(id, author);
  tagsIndex.addId(id, tags);
  tagsAndAuthorIndex.addId(id, author, tags);
}

function updateArticleIds(article, editArticle) {
  if (!editArticle) return;

  const id = article._id;
  authorIndex.update(id, article.author, editArticle.author);
  tagsIndex.update(id, article.tags, editArticle.tags);
  tagsAndAuthorIndex.update(id, article, editArticle);
}

function filterArticlesIds(filter) {
  if (!filter) return null;

  const author = filter.author;
  const tags = filter.tags;

  if (author && tags && tags.length !== 0) {
    return tagsAndAuthorIndex.getIds(author, tags);
  }

  if (author) {
    return authorIndex.getIds(author);
  }

  if (tags && tags.length !== 0) {
    return tagsIndex.getIds(tags);
  }

  return null;
}

module.exports = {
  init,

  createArticleIds,
  filterArticlesIds,
  updateArticleIds,
  deleteArticleIds,
};
