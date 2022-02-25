const express = require('express');
const BookGenreController = require('../controllers/BookGenreController.js');
const auth = require('../middlewares/auth.js');

const Router = express.Router();

Router.get('/list',auth,BookGenreController.getBookGenres);
Router.get('/:genreId',BookGenreController.getGenreById);
Router.post('/',auth,BookGenreController.addGenre);
Router.put('/:genreId',BookGenreController.updateGenreById);
Router.delete('/:genreId',BookGenreController.removeGenreById);


module.exports = Router;