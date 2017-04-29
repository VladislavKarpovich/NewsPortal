const sessionsDb = require('../db').GetSessionsDB();
const usersDb = require('../db').GetUsersDB();

function getSession(id) {
  return new Promise((resolve, reject) => {
    const session = sessionsDb.findOne({ _id: id });
    if (session) {
      resolve(session);
      return;
    }
    reject();
  });
}

function updateSession(id, session) {
  return new Promise((resolve, reject) => {
    const options = { upsert: true };
    const result = sessionsDb.update({ _id: id }, session, options);
    if (result.updated === 1) {
      resolve();
      return;
    }
    reject();
  });
}

function removeSession(id) {
  return new Promise((resolve, reject) => {
    const result = sessionsDb.remove({ _id: id });
    if (result) {
      resolve();
      return;
    }
    reject();
  });
}

module.exports = {
  getSession,
  removeSession,
  updateSession
};
