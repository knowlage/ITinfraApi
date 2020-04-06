const express = require('express')
const mysql = require('mysql2')
const config = require('../config/config.json')

const router = express.Router()
const conn = mysql.createPool(config.database)

router.get('/',(req,res) => {
    res.end('hi download page')
})

router.get('/getUploads',(req,res) => {
    let sql = 'call Upload_get_upload()'
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql,(err,rs,field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0,"message":"Upload Not Found"})
                }  
            }
        })
    })
})

router.get('/getUploadSearch/:search',(req,res) => {
    let sql = 'call Upload_search(?)'
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql,[req.params.search],(err,rs,field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0,"message":"Upload Not Found"})
                }
            }
        })
    })
})

module.exports = router