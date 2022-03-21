const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
require("dotenv").config()

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    token: jwt.sign({ _id: userOneId }, process.env.SECRET)
}
