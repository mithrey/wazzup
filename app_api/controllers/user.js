const User = require('../models/user');
const Note = require('../models/note');
const db = require('../models/db');
const Op = db.Sequelize.Op;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config')
const secret = config.get('secret');

const sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};



module.exports.getUsers = async function(req, res){
    
    User.findAll({})
    .then(users => {
        sendJsonResponse(res, 200, users.map(x => x.dataValues.login));
    }).catch(e => {
        console.log('error', e);
        sendJsonResponse(res, 400, 'error')
    });
}

module.exports.getBalance = async function(req, res){

    let authorization = req.headers.authorization.split(' ')[1],
    decoded;
    try {
        decoded = jwt.verify(authorization, secret);
    } catch (e) {
        return sendJsonResponse(res, 400, {code: 1020, message: 'JWT error'});
    }
    
    let sender = await User.findOne({
        where:{
            id: decoded._id
        }
    });

    if(!sender){
        return sendJsonResponse(res, 400, {code: 1015, message: 'Invalid sender'});
    }
    sendJsonResponse(res, 200, sender.dataValues.balance);

}