const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("express");
const passport = require("./api/utils/passport-configs");

const indexRouter = require('./api/routes/indexRoutes');
const registerRoutes = require('./api/routes/registerRoutes');
const loginRoutes = require('./api/routes/loginRoutes');
const categoryRoutes = require('./api/routes/categoryRoutes');

const app = express();

app.use(bodyParser.json());
app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(indexRouter);
app.use(registerRoutes)
app.use(loginRoutes)
app.use(categoryRoutes)


module.exports = app;
