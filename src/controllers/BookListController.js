const { uploadS3, downloadS3, destroyBucketImage } = require('../middlewares/fileupload.js');
const  Booklist = require('../models/Booklist.js');
const BookService = require('../services/BookService.js');
const {formatResponseError} = require('../services/HelperService.js');
const fs = require("fs")
const util = require("util")
// var encoder = new util.TextEncoder('utf-8');
const unlinkFile = util.promisify(fs.unlink)

const BookController = {
    getBookLists: async (req,res) => {
        try {
            const books = await Booklist.find().select("-__v").populate("genreId")
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
    getBookImages: async (req,res)=>{
        try {
            const key = req.params.key
            const readStream = downloadS3(key)
            return readStream.pipe(res) 
            // return res.status(200).json({
            //     message:"File successfully fetch"
            // })
        } catch (error) {
            console.log(error)
        }
    },
    uploadBookImage: async (req,res)=> {
       const file = req.file;
       try {
        const result = await uploadS3(file)
        await unlinkFile(file.path)
        let book = await Booklist.findOne({_id:req.params.bookId})
        if(!book) return res.status(404).json({error:"book not found"});
        if(book.imageUrl){
            let key = book.imageUrl.split("/")[2]
            await destroyBucketImage(key)
        }
        book.imageUrl = `book/image/${result.Key}`
        book = await book.save()
        if(book){
            return res.status(200).json({
                status:200,
                message:"File upload successful",
                data:book
            });
        }
       } catch (error) {
            console.log(error)
            if (error.kind == 'ObjectId') {
                return res.status(400).json({ error: 'Invalid book Id' });
            }
            return res.status(500).json({error});
       }
    },
    addBook : async (req,res) => {
        try {
            const { value, error } = BookService.validateBookRequestBody(req.body);
            if(error) return res.status(400).json(formatResponseError(error))
            let book = new Booklist(value);
            book.imageUrl = null
            book = await book.save();
            return res.status(200).json({
                status:200,
                message:"successfully processed",
                data:book
            });
        } catch (error) {
            let errorMsg = Object.entries(error.errors).reduce((acc,[key,value])=>{
                return {
                    ...acc,
                    [key]:value.message
                }
            },{})
            return res.status(500).send({errorMsg});
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
            if(book.imageUrl){
                let key = book.imageUrl.split("/")[2]
                await destroyBucketImage(key)
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