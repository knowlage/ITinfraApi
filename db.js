const mysql = require('mysql')
const config = require('./config/config.json')

const conn = mysql.createConnection(config.database)

conn.connect((err) => {
    if(err){
        console.log(err)
    }else{
        console.log("Conected")
    }
})

conn.end()