const express = require('express')
const mysql = require('mysql2')
const config = require('../config/config.json')


const router = express.Router()
const conn = mysql.createPool(config.database)


router.get('/',(req,res) => {
    res.end('carousel api')
})

router.get('/getCarousels',(req,res) => {
    let sql = 'call Carousel_get_carousel_news()'
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql,(err,rs) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0,"message":"Carousel Not Found"})
                }
            }
        })
    })
})

module.exports = router