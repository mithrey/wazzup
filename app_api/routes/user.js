const express = require('express');
const router = express.Router();
const config = require('../../config')
const secret = config.get('secret');

const jwt = require('express-jwt');

const auth = jwt({
    secret: secret,
    _userProperty: 'payload'
});

const ctrlUser = require('../controllers/user');

router.get('/users', ctrlUser.getUsers);
router.get('/user/balance', ctrlUser.getBalance);
//router.post('/pay', ctrlUser.pay);

module.exports = router;