const router = require('express').Router();
const bodyParser = require('body-parser');
const express = require('express');
const config = require('../config');
const morgan = require('morgan');
const authorization = require('./authorization');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(config.get('viewsFolder')));
router.use(morgan('dev'));

router.use(authorization);

module.exports = router;
