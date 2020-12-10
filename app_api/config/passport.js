const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');;
const crypto = require('crypto');

const validPassword = function(password, userHash, salt){
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return userHash === hash;
};

passport.use(new LocalStrategy({
        usernameField: 'login'
    },
        function (username, password, done) {
            
            User.findOne({
                where:{
                    login : username
                }
            }).then( user => {
                //console.log('passport USER ', password, user.dataValues.hash, user.dataValues.salt );
                    if(!user){
                        return done(null, false, {
                            code: 1003,
                            message: 'Incorrect username.'
                        });
                    }

                    if(!validPassword(password, user.dataValues.hash, user.dataValues.salt)){
                        return done(null, false, {
                            code: 1004,
                            message: 'Incorrect password.'
                        });
                    }

                    return done(null, user.dataValues);
            })
            .catch(err => done(err));
    }
));