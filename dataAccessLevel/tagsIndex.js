const _ = require('underscore');

const tagsIndex = {};

function createTagBucket(tagKey) {
  let tagBucket = tagsIndex[tagKey];
  if (!tagBucket) {
    tagsIndex[tagKey] = [];
    tagBucket = tagsIndex[tagKey];
  }
  return tagBucket;
}

function removeTagId(id, articleIds) {
  const index = articleIds.indexOf(id);
  articleIds.splice(index, 1);
}

function getIds(tags) {
  const idsArr = tags.map(tagKey => tagsIndex[tagKey]);
  return _.intersection.apply(this, idsArr);
}

function update(id, oldTags, newTags) {
  if (!newTags || newTags.length === 0) return;

  deleteId(id, oldTags);
  addId(id, newTags);
}

function deleteId(id, tags) {
  if (!tags || tags.length === 0) return;
  tags.map(tagKey => tagsIndex[tagKey])
    .forEach(ids => removeTagId(id, ids));
}

function addId(id, tags) {
  if (!tags || tags.length === 0) return;

  tags.map(tagKey => createTagBucket(tagKey))
    .forEach(tagBucket => tagBucket.push(id));
}

module.exports = {
  getIds,
  update,
  deleteId,
  addId,
};
