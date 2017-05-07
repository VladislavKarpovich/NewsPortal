const meduza = require('../services/meduzaResources');

function getArticleFromMeduza(req, res) {
  const url = `https://meduza.io/api/v3/${req.query.url}`;
  meduza.getArticle(url).then(
    article => res.status(200).json(article),
    () => res.sendStatus(404)
  );
}

module.exports = {
  getArticleFromMeduza
};
