const express = require("express")
const restRouter = require('./src/routes/index.js');
const connectDB = require('./src/utils/db')

const app = express()
app.use(express.json({ extended: false}));
app.use(express.static("images"))

connectDB()

app.use('/api/v1',restRouter);


module.exports = app;
