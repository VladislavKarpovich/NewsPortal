const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userDb = require('../db').GetUsersDB();

passport.serializeUser((user, done) => {
  console.log('serialize' + user);
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  const user = userDb.findOne({ username });
  if (!user) return done(null, false);
  return done(null, user);
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = userDb.findOne({ username });
    if (!user) return done(null, false);
    if (user.password !== password) return done(null, false);
    return done(null, user);
  }
));

module.exports = passport;
