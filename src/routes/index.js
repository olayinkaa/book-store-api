const express = require('express');
const BookListRoute = require('./BookListRoute.js');
const BookGenreRoute = require('./BookGenreRoute.js');
const UserRoute = require('./UserRoute.js');

const restRouter = express.Router();

restRouter.use('/book',BookListRoute);
restRouter.use('/genre',BookGenreRoute);
restRouter.use('/user',UserRoute);

module.exports = restRouter;