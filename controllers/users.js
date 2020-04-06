const express = require('express')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const hasRoleMiddleware = require('../middlewares/hasRoleMiddleware') 
const config = require('../config/config.json')
const router = express.Router()

const conn = mysql.createConnection(config.database)


router.get('/',(req,res) => {
    res.status(200).send('users page')
})

router.get('/detail',hasRoleMiddleware(['manager']),(req,res) => {    
    var decoded = jwt.decode(req.headers.authorization)
    let sql = 'call Eim_get_user(?)' 
    conn.query(sql,[decoded.sub],(err,rs) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }else{            
            if(rs[0].length > 0){
                res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
            }else{
                res.status(200).json({"code":0,"message":"User Not Found"})
            }            
        }
    })    
   
})


router.get('/getname/:id',(req,res) => {    
    let sql = 'call Eim_get_name(?)'
    conn.query(sql,[req.params.id],(err,rs) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }else{
            if(rs[0].length > 0){
                res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
            }else{
                res.status(200).json({"code":0,"message":"User Not Found"})
            }
        }
    })
    
})

module.exports = router