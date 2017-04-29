const router = require('express').Router();
const bodyParser = require('body-parser');
const express = require('express');
const config = require('../config');
//const authorization = require('./authorization');
const log = require('winston');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(config.get('viewsFolder')));

module.exports = router;
