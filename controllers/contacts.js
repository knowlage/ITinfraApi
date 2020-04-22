const express = require('express')
const mysql = require('mysql2')
const config = require('../config/config.json')
const bodyParser = require('body-parser')

const router = express.Router()
const conn = mysql.createPool(config.database)
router.use(bodyParser.json())

router.get('/',(req,res) => {
    res.end('contacts api')
})

router.post('/insertQuestion', (req,res) => {
    let _q = req.body.question_text
    let _f = req.body.question_from
    let sql = 'call Question_insert(?,?)'    
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql,[_q,_f],(err,rs) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{                
                if(rs[0].length > 0){
                    res.status(200).json({"code":1,"message":"Insert Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0,"message":"Insert Fail"})
                }
                
            }
        })
    })
})

module.exports = router