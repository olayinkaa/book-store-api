const  Booklist = require('../models/Booklist');
const BookService = require('../services/BookService.js');
const {formatResponseError} = require('../services/HelperService.js');

const BookController = {
    getBookLists: async (req,res) => {
        try {
            const books = await Booklist.find().select("-__v").populate("genres")
            if(!books) return res.status(404).json({error:"books not found"});
            return res.status(200).json({
                status:200,
                message:"successfully processed",
                data:books
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
    },
    getBookById: async (req,res)=> {
       try {
        const book = await Booklist.findById(req.params.bookId).select('-__v -createdAt -updatedAt');
        if(!book) return res.status(404).json({error:"book not found"});
        return res.status(200).json({
            status:200,
            message:"successfully processed",
            data:book
        })
       } catch (error) {
            console.log(error)
            if (error.kind == 'ObjectId') {
                return res.status(400).json({ error: 'Invalid book Id' });
            }
            return res.status(500).send(error);
       }
    },
    addBook : async (req,res) => {
        try {
            const { value, error } = BookService.validateBookRequestBody(req.body);
            if(error) return res.status(400).json(formatResponseError(error))
            let book = new Booklist(value);
            book = await book.save();
            return res.status(200).json({
                status:200,
                message:"successfully processed",
                data:book
            });
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
    },
    updateBookById: async (req,res) => {
       try {
            const {bookId} = req.params
            const { value, error } = BookService.validateBookRequestBody(req.body);
            if(error) return res.status(400).json({error})
            const book = await Booklist.findOneAndUpdate({ _id: bookId }, value, { new: true, runValidators:true });
            return res.status(200).json({
                status:200,
                message:"successfully updated",
                data:book
            });
       } catch (error) {
        console.error(error);
            if (error.kind == 'ObjectId') {
                return res.status(400).json({ error: 'Invalid book Id' });
            }
            return res.status(500).send(error);
       }
    },
    removeBookById: async (req,res)=> {
        try {
            const { bookId } = req.params;
            const book = await Booklist.findOneAndRemove({ _id: bookId });
            if (!book) {
              return res.status(404).json({ err: 'could not find book' });
            }
            return res.json({message:"Book successfully deleted"});
          } catch (error) {
            if (error.kind == 'ObjectId') {
                return res.status(400).json({ error: 'Invalid book Id' });
            }
            return res.status(500).send(error);
        }
    }
}

module.exports = BookController;