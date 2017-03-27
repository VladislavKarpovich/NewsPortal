const http = require('http');
const reqHandles = require('./reqHandels');

http.createServer(reqHandles.get).listen(3000, () => console.log('Listening on port 3000'));