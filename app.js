const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const log = require('winston');
const articles = require('./controllers/articles');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + config.get('viewsFolder')));

app.get('/', (req, res) => {
    res.send('index.html');
});

app.get('/articles', articles.getArticles);
app.get('/article/:id', articles.findById);
app.post('/article', articles.addArticle);
app.put('/article/:id', articles.editArticle);
app.delete('/article/:id', articles.deleteElement);

app.use((req, res) => {
    res.send(404, 'Page not found');
    log.error(`Page not found ${req.url}`);
});

app.use((err, req, res, next) => {
    res.send(500, 'Server error');
    log.error(err);
});

app.listen(config.get('port'), () => log.info(`listening port ${config.get('port')}`));
