const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const passport = require('../models/passport');
const SessionStore = require('connect-diskdb')(sessions);
const router = require('express').Router();
const log = require('winston');

const options = {
  path: './data',
  name: 'sessions',
};
const diskDBSessionStore = new SessionStore(options);

router.use(cookieParser());
router.use(sessions({
  secret: 'B9CelARkWkXWqKzkCVAzjV7Nftan9WB9CelARkWkXWqKzkCVAzjV7Nftan9WqDqD',
  resave: false,
  saveUninitialized: false,
  store: diskDBSessionStore,
}));

router.use(passport.initialize());
router.use(passport.session());


router.post('/login', (req, res) => {
  passport.authenticate('local', (err, user) => {
    if (!user) { return res.status(401).end('Error'); }
    const sess = req.session;
    sess.user = user;
    sess.save(errorHandle);

    log.info(`login ${user.username}`);
    return res.end('Authenticated!');
  })(req, res);
});

router.delete('/logout', (req, res) => {
  req.session.destroy(errorHandle);
  res.sendStatus(200);
});

router.get('/user', (req, res) => {
  const sess = req.session;
  res.send(sess.user);
});

function errorHandle(err) {
  if (!err) return;
  log.error(err);
}

module.exports = router;
