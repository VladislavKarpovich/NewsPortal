const winston = require('winston');
const config = require('../config');

function GetLogger(module) {
  const log = new winston.Logger({
    transports: [
      new winston.transports.Console({
        colorize: true,
        level: config.get('env'),
      })
    ]
  });
  return log;
}

module.exports = GetLogger;
