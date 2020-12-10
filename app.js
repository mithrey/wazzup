const debug = require('debug')('test:app.js');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./app_api/models/db');
require('./app_api/config/passport');

const app = express();
const expressWs = require('express-ws')(app);



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

/**
 * HTTP routing -- begin
 */

var authApi = require('./app_api/routes/authentication');
app.use('/api', authApi);

var noteApi = require('./app_api/routes/note');
app.use('/api', noteApi);

var userApi = require('./app_api/routes/user');
app.use('/api', userApi);

app.use('/', express.static(path.join(__dirname, 'app_client/dist')));
app.use('/r/:path', express.static(path.join(__dirname, 'app_client/dist')));


/**
 * HTTP routing -- end
 */

module.exports = app;
