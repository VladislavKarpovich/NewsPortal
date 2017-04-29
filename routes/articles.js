const router = require('express').Router();
const sideResources = require('../controllers/sideResources');
const articles = require('../controllers/articles');

router.get('/filter', articles.getArticles);
router.get('/:id', articles.findById);
router.post('/', articles.addArticle);
router.put('/:id', articles.editArticle);
router.delete('/:id', articles.deleteElement);

router.get('/side', sideResources.getArticleFromMeduza);

module.exports = router;
