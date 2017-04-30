const config = require('../config');
const passport = require('../models/passport');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const SessionStore = require('connect-diskdb')(sessions);
const router = require('express').Router();

const options = config.get('connectDiskdb:options');
const diskDBSessionStore = new SessionStore(options);

router.use(cookieParser());
router.use(sessions({
  secret: config.get('session:secret'),
  resave: config.get('session:resave'),
  saveUninitialized: config.get('session:saveUninitialized'),
  store: diskDBSessionStore,
  cookie: config.get('session:cookie')
}));

router.use(passport.initialize());
router.use(passport.session());

module.exports = router;
