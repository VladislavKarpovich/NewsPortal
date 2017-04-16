const authorIndex = {};


function createAuthorBucket(author) {
  let authorBucket = authorIndex[author];
  if (!authorBucket) {
    authorBucket = [];
    authorIndex[author] = authorBucket;
  }
  return authorBucket;
}

function removeArticleId(id, ids) {
  const index = ids.indexOf(id);
  ids.splice(index, 1);
}

function getIds(author) {
  return authorIndex[author];
}

function update(id, oldAuthor, newAuthor) {
  if (!newAuthor) return;

  deleteId(id, oldAuthor);
  addId(id, newAuthor);
}

function deleteId(id, author) {
  if (!author) return;
  const ids = authorIndex[author];
  removeArticleId(id, ids);
}

function addId(id, author) {
  if (!author) return;
  const authorBacket = createAuthorBucket(author);
  authorBacket.push(id);
}

module.exports = {
  getIds,
  update,
  deleteId,
  addId,
};
