const config = require('../config');
const passport = require('../models/passport');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const express = require('express');
const MongoStore = require('connect-mongo')(sessions);

const router = express.Router();

router.use(cookieParser());
router.use(sessions({
  secret: config.get('session:secret'),
  resave: config.get('session:resave'),
  saveUninitialized: config.get('session:saveUninitialized'),
  store: new MongoStore({
    url: config.get('mongoose:url'),
    touchAfter: 24 * 3600
  }),
  cookie: config.get('session:cookie')
}));

router.use(passport.initialize());
router.use(passport.session());

module.exports = router;
