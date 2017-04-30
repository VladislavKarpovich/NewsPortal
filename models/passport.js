const config = require('../config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userDb = require('../db').GetUsersDB();

const messages = config.get('passportMessages');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((username, done) => {
  const user = userDb.findOne({ username });
  if (!user) return done(null, false);
  return done(null, user);
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = userDb.findOne({ username });
    if (!user) {
      done({ message: messages.loginError }, false);
      return;
    }
    if (user.password !== password) {
      done({ message: messages.passwordError }, false);
      return;
    }
    done(null, user);
  }
));

module.exports = passport;
