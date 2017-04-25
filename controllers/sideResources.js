const meduza = require('../models/meduzaResources');

function getArticleFromMeduza(req, res) {
  const url = `https://meduza.io/api/v3/${req.query.url}`;
  const promise = meduza.getArticle(url);
  promise.then(
    article => res.status(200).send(article),
    () => res.sendStatus(404)
  );
}

module.exports = {
  getArticleFromMeduza
};
