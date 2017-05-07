const passport = require('../models/passport');
const log = require('../libs/log')(module);

function login(req, res) {
  passport.authenticate('local', (err, user) => {
    console.log(req);
    if (user) saveSession(req.session, user);
    return res.status(200).send({ err, user });
  })(req, res);
}

function saveSession(session, user) {
  session.user = user;
  session.save();
  log.info(`login ${user.username}`);
}

function logout(req, res) {
  req.session.destroy(errorHandle);
  res.send(200).end();
}

function getUser(req, res) {
  const sess = req.session;
  res.send(sess.user);
}

function errorHandle(err) {
  if (!err) return;
  log.error(err);
}

module.exports = {
  login,
  logout,
  getUser
};
