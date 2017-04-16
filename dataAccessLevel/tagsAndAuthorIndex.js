const _ = require('underscore');

const authorTagsIndex = {};

const dateBucketCreator = {
  author: (author) => {
    let authorBucket = authorTagsIndex[author];
    if (!authorBucket) {
      authorBucket = {};
      authorTagsIndex[author] = authorBucket;
    }
  },
  tags: (author, tag) => {
    let bucket = authorTagsIndex[author][tag];
    if (!bucket) {
      bucket = [];
      authorTagsIndex[author][tag] = bucket;
    }
    return bucket;
  },
};

function createDateBucket(author, tag) {
  dateBucketCreator.author(author);
  return dateBucketCreator.tags(author, tag);
}

function removeArticleId(id, ids) {
  const index = ids.indexOf(id);
  ids.splice(index, 1);
}


function getIds(author, tags) {
  const idsArr = tags.map(tagKey => authorTagsIndex[author][tagKey]);
  return _.intersection.apply(this, idsArr);
}

function update(id, oldArticle, newArticle) {
  if (!newArticle.tags || newArticle.tags.length === 0) return;

  deleteId(id, oldArticle.author, oldArticle.tags);
  addId(id, newArticle.author, newArticle.tags);
}

function deleteId(id, author, tags) {
  tags.map(tagKey => authorTagsIndex[author][tagKey])
    .forEach(ids => removeArticleId(id, ids));
}

function addId(id, author, tags) {
  tags.map(tagKey => createDateBucket(author, tagKey))
    .forEach(bucket => bucket.push(id));
}

module.exports = {
  getIds,
  update,
  deleteId,
  addId,
};
