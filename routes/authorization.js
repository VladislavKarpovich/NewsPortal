const router = require('express').Router();
const authorization = require('../controllers/authorization');

router.post('/login', authorization.login);
router.post('/logout', authorization.logout);
router.get('/user', authorization.getUser);

module.exports = router;
