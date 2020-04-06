const express = require('express')
const mysql = require('mysql2')
const config = require('../config/config.json')


const router = express.Router()
const conn = mysql.createPool(config.database)


router.get('/getfaqs',(req,res) => {
    let sql = 'call FAQs_get_faqs()'
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})  
        }
        connection.query(sql,(err,rs,field) => {
            connection.release()
            if(rs[0].length > 0){
                res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
            }else{
                res.status(200).json({"code":0,"message":"User Not Found"})
            }  
        })
    })

   
    
})

router.get('/getFaqsSearch/:_search',(req,res) => {   

    let sql = "call FAQs_search(?)"
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql,[req.params._search],(err,rs,field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0,"message":"FAQs Not Found"})
                }  
            }
        })
    })
    
})


module.exports = router