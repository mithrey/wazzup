const passport = require('passport');
const User = require('../models/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config')
const secret = config.get('secret');
const JWTlifeTime = config.get('JWTlifeTime');


const setPassword = function(password, salt){
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash;
};



const generateJwt = function(name, id){
    let expiry = Date.now() + JWTlifeTime;
    return jwt.sign({
        _id: id,
        name: name,
        exp: expiry/1000
    }, secret);
};


const sendJsonResponse = function(res, status, content){
    res.status(status);
    res.json(content);
};

module.exports.register = async function (req, res) {
    let login = req.body.login;
    let name = req.body.name;
    let password = req.body.password;


    if(!name || !password || !login){
        return sendJsonResponse(res, 400, {
            code: 1000,
            "message": "fields 'name', 'login' and 'password' required"
        });
    }

    let alreadyRegistered = await User.findOne({where:{login:login}});
    if(alreadyRegistered){
        return sendJsonResponse(res, 400, {
            code: 1006,
            "message": "login already registered"
        });
    }

    let salt = crypto.randomBytes(16).toString('hex');
    let userData = {
        name: name,
        login: login,
        salt: salt,
        hash: setPassword(password, salt)
    };
    
    User.create(userData)
        .then(user => {

            token = generateJwt(user.name, user.id);
            sendJsonResponse(res, 200, {
               "token": token
            });
        })
        .catch(err => sendJsonResponse(res, 400, {code: 1005, message:"Registration error"}))

};

module.exports.login = function (req, res) {
    if(!req.body.login || !req.body.password){
        sendJsonResponse(res, 400, {
            "message": "fields 'user' and 'password' required"
        });
        return;
    }


    passport.authenticate('local',{}, function (err, user, info) {
       let token;

       console.log('req', user);
       if(err){
        console.log('err', err);
           sendJsonResponse(res, 404, err);
           return;
       }

       if(user){
           token = generateJwt(user.name, user.id); 
           sendJsonResponse(res, 200, {
               token: token,
               name: user.name,
               balance: user.balance,
               id: user.id,
               login: user.login
           });
       } else {
           sendJsonResponse(res, 401, info);
       }

    })(req, res);
};

