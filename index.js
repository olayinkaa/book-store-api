const app = require("./app.js")
const {PORT} = require('./src/utils/configs.js');

app.listen(PORT || 5000,()=>{
    console.log(`server running on port: ${PORT}`)
})