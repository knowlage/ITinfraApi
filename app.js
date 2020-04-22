const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
var cors = require('cors')



app = express()
app.use(bodyParser.json())
app.use(cors())
app.use('/assets',express.static(path.join(__dirname,'assets')))

app.use(require('./controllers'))


app.listen(8000,() => {
    console.log('Server Start at port 8000')
})