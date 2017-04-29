const express = require('express');
const config = require('./config');
const log = require('winston');
const middlewares = require('./middlewares');
const articles = require('./routes/articles');
const authorization = require('./routes/authorization');

const app = express();
app.use('/articles', articles);
app.use(middlewares);
app.use(authorization);

app.use((req, res) => {
  res.send(404, 'Page not found');
  log.error(`Page not found ${req.url}`);
});

app.use((err, req, res, next) => {
  res.send(500, 'Server error');
  log.error(err);
});

app.listen(config.get('port'), () => log.info(`listening port ${config.get('port')}`));
