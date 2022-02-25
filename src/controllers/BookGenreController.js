const  Genre = require('../models/BookGenre');
const GenreService = require('../services/GenreService.js');
const {formatResponseError} = require('../services/HelperService.js');

const GenreController = {
    getBookGenres: async (req,res) => {
        try {
            const genres = await Genre.find().select("-__v -user")
            if(!genres) return res.status(404).json({error:"book genres not found"});
            return res.status(200).json({
                status:200,
                message:"successfully processed",
                data:genres
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
    },
    getGenreById: async (req,res)=> {
       try {
        // const genre = await Genre.findById(req.params.genreId).select('-__v -createdAt -updatedAt');
        const genre = await Genre.findOne({_id:req.params.genreId, user:req.user.id}).select('-__v -createdAt -updatedAt');
        if(!genre) return res.status(404).json({error:"genre not found"});
        return res.status(200).json({
            status:200,
            message:"successfully processed",
            data:genre
        })
       } catch (error) { 
            console.log(error)
            if (error.kind == 'ObjectId') {
                return res.status(400).json({ error: 'Invalid genre ID' });
            }
            return res.status(500).send(error);
       }
    },
    addGenre : async (req,res) => {
        try {
            const { value, error } = GenreService.validateRequestBody(req.body);
            if(error) return res.status(400).json(formatResponseError(error))
            let genre = new Genre(value);
            genre.user =  req.user.id
            genre = await genre.save();
            return res.status(200).json({
                status:200,
                message:"successfully processed",
                data:genre
            });
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
    },
    updateGenreById: async (req,res) => {
       try {
            const {genreId} = req.params
            const { value, error } = GenreService.validateRequestBody(req.body);
            if(error) return res.status(400).json({error})
            const genre = await Genre.findOneAndUpdate({ _id: genreId }, value, { new: true, runValidators:true });
            return res.status(200).json({
                status:200,
                message:"successfully updated",
                data:genre
            });
       } catch (error) {
        console.error(error);
            if (error.kind == 'ObjectId') {
                return res.status(400).json({ error: 'Invalid genre ID' });
            }
            return res.status(500).send(error);
       }
    },
    removeGenreById: async (req,res)=> {
        try {
            const { genreId } = req.params;
            const genre = await Genre.findOneAndRemove({ _id: genreId });
            if (!genre) {
              return res.status(404).json({ err: 'could not find genre' });
            }
            return res.json({message:"Genre successfully deleted"});
          } catch (error) {
            if (error.kind == 'ObjectId') {
                return res.status(400).json({ error: 'Invalid category ID' });
            }
            return res.status(500).send(error);
        }
    }
}

module.exports = GenreController;