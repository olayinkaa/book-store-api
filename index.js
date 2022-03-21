const YAML = require('yamljs')
const swaggerUI = require("swagger-ui-express")
const swaggerDocument = YAML.load("./src/utils/api.yaml");
const app = require("./app.js")
const {PORT} = require('./src/utils/configs.js');

app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument)
);

app.listen(PORT || 5000,()=>{
    console.log(`server running on port: ${PORT}`)
})