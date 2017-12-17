// Express
const express = require('express');
const https = require('https');
const app = express();

// Configuration
require('dotenv').config();
app.locals.config = require('_/config');
app.set('trust proxy', true); // allows app to receive requests from Nginx

// Third-party Middleware
const bodyparser = require('body-parser');
app.use(bodyparser.json()); // for parsing application/json
app.use(bodyparser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(require('express-validator')());

// Third-party Libraries
app.locals.pbkdf2 = require('easy-pbkdf2')();
app.locals.jwt = require('jsonwebtoken');

// Custom Middleware
const loginValidation = require('_/middleware/login-validation');
const tokenVerify = require('_/middleware/token-verify');

// Route Logic
const signup = require('_/routes/signup');
const login = require('_/routes/login');
const users = require('_/routes/users');

// Logging
const morgan = require('morgan');
app.use(morgan('dev'));

// Database
const mongoose = require('mongoose');
mongoose.connect(app.locals.config.database);

// Models
app.locals.User = require('_/models/user');

// Application Routing
app.get('/', (req, res) => { res.json({ message: 'wombo_bauth' }); });
app.use('/signup', [loginValidation, signup]);
app.use('/login', [loginValidation, login]);
app.use('/users', [tokenVerify, users]);

// Start Service
https.createServer(app.locals.config.credentials, app).listen(app.locals.config.port);
console.log('Listening at ' + app.locals.config.port);
