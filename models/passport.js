const config = require('../config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User').User;

const messages = config.get('passportMessages');

passport.deserializeUser((username, done) => {
  User.findOne({ username }, done);
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    passport.deserializeUser(username, (err, user) => {
      if (!user) {
        const mess = { message: messages.loginError };
        return done(mess, false);
      }
      if (!user.checkPassword(password)) {
        const mess = { message: messages.passwordError };
        return done(mess, false);
      }
      user.salt = null;
      user.hashedPassword = null;
      return done(null, user);
    });
  }
));

module.exports = passport;
