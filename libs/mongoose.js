const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.get('mongoose:url'));

module.exports = mongoose;
