const express = require('express');
const UserController = require('../controllers/UserController.js');
const auth = require('../middlewares/auth.js');

const Router = express.Router();

Router.post('/login',UserController.login)
Router.post('/register',UserController.registerUser)
Router.get('/register',auth,UserController.getRegisteredUser)
// Router.post('/login',UserController.login)

module.exports = Router;