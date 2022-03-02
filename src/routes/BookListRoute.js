const express = require('express');
const BookController = require('../controllers/BookListController.js');
const { upload } = require('../middlewares/fileupload.js');
// const auth = require('../middlewares/auth.js');

const Router = express.Router();

Router.post('/',BookController.addBook);
Router.get('/list',BookController.getBookLists);
Router.get('/:bookId',BookController.getBookById);
Router.put('/:bookId',BookController.updateBookById);
Router.delete('/:bookId',BookController.removeBookById);
Router.get('/image/:key',BookController.getBookImages);
Router.post('/:bookId/upload',upload.single("image"),BookController.uploadBookImage,(error,req,res,next)=>{
    res.status(400).json({error:error.message})
});



module.exports = Router;