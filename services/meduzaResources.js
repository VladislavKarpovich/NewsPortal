const request = require('request');
const zlib = require('zlib');

function getArticle(url) {
  return new Promise((resolve, reject) => {
    request(url, { encoding: null }, (reqErr, response, body) => {
      if (reqErr || response.headers['content-encoding'] !== 'gzip') {
        reject(reqErr || body);
        return;
      }
      gunzip(body).then(resolve, reject);
    });
  });
}

function gunzip(body) {
  return new Promise((resolve, reject) => {
    zlib.gunzip(body, (err, dezipped) => {
      if (err) {
        reject(err);
        return;
      }

      const article = JSON.parse(dezipped.toString());
      console.log(convertArticle(article));
      resolve(convertArticle(article));
    });
  });
}


function convertArticle(meduzaArticle) {
  const root = meduzaArticle.root;

  const article = {
    title: root.title,
    shortDescription: root.description,
    images: getImages(root),
    text: parseText(root.content.body),
    author: 'Meduza',
    createdAt: Date.now()
  };

  return article;
}

function getImages(root) {
  if (root.gallery) {
    const g = root.gallery;
    return g.map(obj => `https://meduza.io/${obj.original_url}`);
  }

  const img = root.share_image;
  return [`https://meduza.io/${img}`];
}

function parseText(text) {
  text = text.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, '');
  text = text.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, '');
  text = text.replace(/<img.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/img>/gi, '');
  text = text.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, '');
  text = text.replace(/[\s\n]+/g, ' ');
  const blocks = text.replace(/<(?:.|\n)*?>/gm, '#').split('#');
  const p = blocks.map(b => `<p>${b}</p>`);
  return p.join('\n');
}


module.exports = {
  getArticle
};
