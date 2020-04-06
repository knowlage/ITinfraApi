const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')



app = express()
app.use(bodyParser.json())
app.use(cors())

app.use(require('./controllers'))


app.listen(8000,() => {
    console.log('Server Start at port 8000')
})