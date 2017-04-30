const sessionsDb = require('../db').GetSessionsDB();
const usersDb = require('../db').GetUsersDB();

function get(id) {
  return new Promise((resolve, reject) => {
    const session = sessionsDb.findOne({ _id: id });
    if (session) {
      resolve(session);
      return;
    }
    reject();
  });
}

function set(id, session) {
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

function destroy(id) {
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
  get,
  set,
  destroy
};
