let fs = require('fs');

const EXTENSIONS = {
    '.html': 'text/html',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.css': 'text/css',
    '.js': 'text/javascript'
}

function getMimeType(url) {
    var dotPosition = url.lastIndexOf('.');
    return (dotPosition == 1) ? 'text/plain' : EXTENSIONS[url.substr(dotPosition)];
}

function get(req, res) {
    fs.readFile('./public' + req.url, function (err, data) {
        if (err) {
            console.error('file not found: ' + req.url);
            res.writeHead(404, "Not Found");
            res.end();
            return;
        }

        res.setHeader('Content-type', getMimeType(req.url));
        res.end(data);
        console.log(req.url);
    });
}

exports.get = get;