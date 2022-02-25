const express = require("express")
const restRouter = require('./src/routes/index.js');
const YAML = require('yamljs')
const swaggerUI = require("swagger-ui-express")
const swaggerDocument = YAML.load("./src/utils/api.yaml");
const {PORT} = require('./src/utils/configs.js');
const connectDB = require('./src/utils/db')

const app = express()
app.use(express.json({ extended: false}));

connectDB()

app.use('/api/v1',restRouter);
app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument)
);

app.listen(PORT || 5000,()=>{
    console.log(`server running on port: ${PORT}`)
})