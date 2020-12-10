const express = require('express');
const router = express.Router();

const config = require('../../config')
const secret = config.get('secret');

const jwt = require('express-jwt');

const auth = jwt({
  secret: secret,
  _userProperty: 'payload'
});

const ctrlAuth = require('../controllers/authentication');

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;