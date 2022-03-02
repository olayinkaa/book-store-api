const express = require('express');
const BookGenreController = require('../controllers/BookGenreController.js');
const auth = require('../middlewares/auth.js');

const Router = express.Router();

Router.post('/',auth,BookGenreController.addGenre);
Router.get('/list',auth,BookGenreController.getBookGenres);
Router.get('/:genreId',auth,BookGenreController.getGenreById);
Router.put('/:genreId',auth,BookGenreController.updateGenreById);
Router.delete('/:genreId',auth,BookGenreController.removeGenreById);


module.exports = Router;