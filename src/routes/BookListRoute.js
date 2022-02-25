const express = require('express');
const BookController = require('../controllers/BookListController.js');
// const auth = require('../middlewares/auth.js');

const Router = express.Router();

Router.get('/list',BookController.getBookLists);
Router.get('/:bookId',BookController.getBookById);
Router.post('/',BookController.addBook);
Router.put('/:bookId',BookController.updateBookById);
Router.delete('/:bookId',BookController.removeBookById);


module.exports = Router;