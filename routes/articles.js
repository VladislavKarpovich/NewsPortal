const router = require('express').Router();
const sideResources = require('../controllers/sideResources');
const articles = require('../controllers/articles');

router.get('/filter', articles.getArticles);
router.get('/side', sideResources.getArticleFromMeduza);
router.get('/getbyid/:id', articles.findById);
router.post('/', articles.addArticle);
router.put('/:id', articles.editArticle);
router.delete('/:id', articles.deleteElement);

module.exports = router;
